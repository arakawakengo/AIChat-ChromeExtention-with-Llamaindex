from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from django.shortcuts import render
from requests.auth import HTTPBasicAuth
import requests

import base64
import json
import typing as T

import logging
import dotenv

CLIENT_ID = dotenv.get_key('.env', 'CLIENT_ID').encode()
CLIENT_SECRET = dotenv.get_key('.env', 'CLIENT_SECRET').encode()

def get_access_token():
    r = requests.post('https://apigw.dev.n8s.jp/oauth2/token', auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET), data={'grant_type':'client_credentials'})
    access_token = r.json().get('access_token')
    return access_token
    

class Test(APIView):
    
    def post(self, request):
        logging.debug(request.data)
        
        text = request.data["text"]
        
        result = {
            "text": text + "って言ったか!? 黙れワン!!",
            "result": "OK",
        }
        
        return Response(result, status=200)
    
class Article(APIView):
    
    def get(self, request, article_id):
        
        token = get_access_token()
        
        nikkei_api_endpoint = f"https://apigw.dev.n8s.jp/search/v1/article?kiji_id={article_id}&offset=0&volume=10&fields=belong_topic_info%2C%20body"

        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        nikkei_api_response = requests.get(nikkei_api_endpoint, headers=headers)
         
        data = nikkei_api_response.json()["hits"][0]
        
        topics = [topic_info["topic_name_long"] for topic_info in data["belong_topic_info"]]
        
        response_body = {
            "title": data["title"],
            "topics": topics,
            "keywords": data["keywords"],
            "body": data["body"],
        }
        
        return Response(response_body, status=200)

class RecommendArticle(APIView):
    
    def post(self, request):
        data = request.data
        question_text = data["text"]
        
        token = get_access_token()
        
        morphologic_api_url = "https://apigw.dev.n8s.jp/text-analysis/v1/parse"
        
        response = requests.post(morphologic_api_url, headers={"Authorization": f"Bearer {token}"}, data={"sentence": question_text, "nbest_num": 1})
        data = response.json()
        
        keyword = []
        
        for word in data["items"][0]["words"]:
            if word["pos"] == "名詞":
                if word["pos_detail1"] != "代名詞":
                    keyword.append(word["reading"])
            elif word["pos"] == "形容詞":
                keyword.append(word["reading"])
        
        search_keyword = " ".join(keyword)
        
        article_search_api_url = "https://apigw.dev.n8s.jp/search/v1/article"
        
        query_params = {
            "volume": 10,
            "keyword": search_keyword,
            "fields": "body,canonical_url,featured_image", 
            "signed_featured_image": "true"
        }
        
        
        articles_response = requests.get(article_search_api_url, headers={"Authorization": f"Bearer {token}"}, params=query_params)
        
        articles_data_list = articles_response.json()["hits"]
        
        response_body = []
        
        for article_data in articles_data_list:
            print(article_data)
            try:
                article_info = {
                    "title": article_data["title"],
                    "article_url": article_data["canonical_url"],
                    "image_url": article_data["featured_image"]["src_image_url"]
                }
                response_body.append(article_info)
            except:
                pass
        
        return Response(response_body, status=200)
            