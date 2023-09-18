from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from django.shortcuts import render

import json
import typing as T

import logging

class TEST(APIView):
    
    def post(self, request):
        logging.debug(request.data)
        
        text = request.data["text"]
        
        result = {
            "text": text + "!",
            "result": "OK",
        }
        
        return Response(result, status=200)