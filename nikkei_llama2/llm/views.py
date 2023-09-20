from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from django.shortcuts import render

import json
import typing as T

import logging

class ANSWER_QUESTION(APIView):
    
    def post(self, request):
        logging.debug(request.data)
        
        text = request.data["text"]
        
        # TODO: Generate answer of the question (text).
        
        result = {
            "text": text
        }
        
        return Response(result, status=200)