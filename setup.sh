#!/usr/bin/env bash
# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Docker
sudo apt-get update && sudo apt-get install docker.io -y

# Install Socat
sudo apt-get install socat -y

# Install conntrack
sudo apt-get install -y conntrack

# Install arkade
curl -SLsf https://dl.get-arkade.dev/ | sudo sh

# Install faas-cli
curl -sL https://cli.openfaas.com | sudo sh

sudo sysctl fs.protected_regular=0
