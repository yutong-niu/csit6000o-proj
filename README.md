# csit6000o-proj
CSIT6000o Project - Serverless Shopping Cart

|Name|SID|ITSC|CONTRIBUTION|
|---|---|---|---|
|Niu Yutong|20176192|yniuaa||
|BAI Qian|20786466|qbaiaa|Modified and built frontend service|
|ZHANG Yiwen|20790766|yzhangmp|Replace DynamoDB with MongoDB|
|TONG Jinjian|20788658|jtongad||

## Background
This project derives from the serverless shopping cart project from AWS Sample: [https://github.com/aws-samples/aws-serverless-shopping-cart](https://github.com/aws-samples/aws-serverless-shopping-cart). We use Openfaas to replace AWS Lambda functions and MongoDB to replace AWS DynamoDB.

## Infrastructure
The project is ready for deployment to a kubernetes cluster. To make the deployment simple enough, we build some automation script to deploy the project to a single-node Minikube cluster built on an AWS EC2 machine. The EC2 instance should expose the HTTP port 80 for frontend web application and port 8080 for openfaas functions. The deployments include a MongoDB database, several openfaas functions and a JavaScript Vue Frontend application. All of these are deployed to the same namespace in the Kubernetes cluster: openfaas-fn. The infrastructure is illustrated by the figure below.

![](https://i.ibb.co/nDm3ZzL/infra-drawio-1.png)

## Deploy to an AWS EC2 instance
If the project is deployed to an AWS EC2 instance, we provide a userdata script on EC2 launch.
```bash
#!/bin/bash
git clone https://github.com/yutong-niu/csit6000o-proj.git /var/proj
/var/proj/setup.sh 2>&1 > /tmp/setup.log
sudo /var/proj/deploy.sh 2>&1 > /tmp/deploy.log
```
The user data runs two scripts:
- setup.sh: install minikube, kubectl, docker, socat, conntrack, arkade, faas-cli
- deploy.sh: deploy openfass, custom openfaas functions, mongodb, frontend application

The deploy script also exposes frontend application, and openfaas gateway through ```kubectl port-forward```.

For the test machine, we choose the following config:
|||
|---|---|
|OS|Ubuntu Server 20.04 TLS|
|Architecture|64-bit(x86)|
|Instance Type|M5.large|
|Network|Public Subnet with public IP|
|SG| TCP Ports: 22, 80, 8080 From: Anywhere|
|Storage| 50GiB gp3 on Root volume|

> **The userdata can take up to 10 minutes to be ready on an EC2 machine of type m5.large. After the deployment, all the Openfaas functions can be accessed through {server_ip}:8080/function/{function_name}. And the Frontend Web App can be accessed through http://{server_ip}**

![](https://i.ibb.co/w4Dc9MH/deploy.png)

## Manual Deployment
If the userdata method is not preferred, here is the step-by-step instruction on Manual Deployment.
### Setup
To setup the environment, some packages need to be installed.
| Package | Description |
| --- | --- |
| minikube | Single-node local k8s cluster |
| kubectl | CLI to control k8s cluster |
| docker | All the components of the project is deployed as Docker images |
| socat | Support port forwarding to expose service of k8s cluster |
| conntrack | Support starting Minikube with none driver |
| arkade | Marketplace for Openfaas in k8s |
| faas-cli | CLI to build/delpoy openfaas functions |

Installation Commands:
> **_NOTE:_** These commands are only tested on Ubuntu 20.04 TLS platform
Minikube:
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Kubectl:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Docker:
```bash
sudo apt-get update && sudo apt-get install docker.io -y
```

Socat:
```bash
sudo apt-get install socat -y
```

Conntrack:
```bash
sudo apt-get install -y conntrack
```

Arkade:
```bash
curl -SLsf https://dl.get-arkade.dev/ | sudo sh
```

Faas-cli:
```bash
curl -sL https://cli.openfaas.com | sudo sh
```

### Deploy
> **_NOTE:_** This part needs to be run as the root user
#### Step 1: Start Minikube
```bash
minikube start --driver=none
```
Since we deploy the project to EC2 instance, here we choose not to use a driver for minikube. Sometimes minikube fails to start. A `minikube delete` is necessary before `minikube start --driver=none`. And the minikube will automatically configure kubectl, only if `kubectl` is installed ahead of `minikube start`. Please ensure `kubectl` is installed before running this command.

#### Step 2: Deploy Openfaas
```bash
arkade install openfaas --basic-auth-password password123 --set=faasIdler.dryRun=false
```
Here we use a command line option `basic-auth-password` for simplicity, but this is a deprecated method. The password is used for `faas-cli` to login later. You can always use `kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode` to get the admin password for openfaas.

#### Step 3: Port-forward for Openfaas Gateway
```bash
kubectl port-forward -n openfaas svc/gateway 8080:8080 --address=0.0.0.0 &
```
An Openfaas gateway service(`svc/gateway`) is created on openfaas deployment in `openfaas` namespace, a port forwarding is necessary so that the openfaas functions can be accessed through `{server_ip}:8080/function/{function_name}`. Ensure the gateway service is ready before running this command. And always run this command in the background to keep it from occupying the terminal.

#### Step 4: Deploy Mongodb
```bash
kubectl apply -f ${REPO_HOME}/mongodb.yml
```
Ensure the openfaas deployment finished and a namespace `openfaas-fn` exists before deploying mongodb.

#### Step 5: Deploy Frontend
```bash
kubectl apply -f ${REPO_HOME}/frontend.yml
```
Ensure the openfaas deployment finished and a namespace `openfaas-fn` exists before deploying the frontend app.

#### Step 6: Port-forward for Frontend Web App
```bash
kubectl port-forward -n openfaas-fn svc/frontend-service 80:8080 --address=0.0.0.0 &
```
An frontend service(`svc/frontend-service`) is created on frontend deployment in `openfaas-fn` namespace, a port forwarding is necessary so that the web application can be accessed through `http://{server_ip}`. Ensure the frontend service is ready before running this command. And always run this command in the background to keep it from occupying the terminal.

#### Step 7: Deploy Openfaas Functions
```bash
faas-cli login --username admin --password password123
cd ${REPO_HOME}/faas
faas-cli template store pull python3-http
faas-cli deploy -f stack.yml
```

> **After the deployment, all the Openfaas functions can be accessed through {server_ip}:8080/function/{function_name}. And the Frontend Web App can be accessed through http://{server_ip}**
