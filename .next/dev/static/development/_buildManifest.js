self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "has": [
          {
            "type": "header",
            "key": "accept",
            "value": "(?!application/json)"
          }
        ],
        "source": "/",
        "destination": "/static/index.html"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()