docker build -t tflite_amazonlinux .
docker run -d --name=tflite_amazonlinux tflite_amazonlinux
docker cp tflite_amazonlinux:/usr/local/lib64/python3.7/site-packages dependencies/python/lib/python3.7/
docker stop tflite_amazonlinux
zip -r lib.zip dependencies/python
