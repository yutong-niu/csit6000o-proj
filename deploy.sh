#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

echo "> Starting Minikube"
minikube start --driver=none

echo "> Installing openfaas"
arkade install openfaas --basic-auth-password password123 --set=faasIdler.dryRun=false

echo "> Waiting until openfaas gateway is ready"
kubectl rollout status -n openfaas deploy/gateway

echo "> Port forwarding for openfaas gateway"
kubectl port-forward -n openfaas svc/gateway 8080:8080 --address=0.0.0.0 &

echo "> Logging in to faas-cli"
faas-cli login --username admin --password password123

echo "> Deploying mongodb"
kubectl apply -f ${SCRIPT_DIR}/mongodb.yml

echo "> Deploying frontend"
kubectl apply -f ${SCRIPT_DIR}/frontend.yml

echo "> Waiting until frontend service is ready"
kubectl rollout status -n openfaas-fn deploy/frontend-deployment

echo "> Port forwarding for frontend"
kubectl port-forward -n openfaas-fn svc/frontend-service 80:8080 --address=0.0.0.0 &

echo "> Deploying openfaas functions"
cd ${SCRIPT_DIR}/faas
faas-cli template store pull python3-http
faas-cli deploy -f stack.yml
