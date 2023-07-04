# Start up the Redis Database
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml

# Creating the Redis leader Service
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml

# Set up Redis followers
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml

# Creating the Redis follower Service
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml

# Set up and Expose the Guestbook Frontend
# Creating the Guestbook frontend Deployment
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml

# Creating the Guestbook frontend Service
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml

# Port Forwarding
echo "Waiting for the frontend Service to be ready..."
echo "This may take a few minutes..."
echo "Check the status with 'kubectl get services'"
echo "Once ready, run command 'kubectl port-forward svc/frontend 8080:80'"
echo "All done! Now you can access the guestbook at http://localhost:8080"


