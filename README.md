# A Microservices based Ecommerce Application

A Microservice based end to end professional grade scalable application with automatic CI/CD. I created this application as part of Udemy Course by Stephen grider called "Microservices with Node JS and React"

# Features and Tech Stack

  -  Each service is created using Node and Express with code written using TypeScript.
  -  NATS Streaming Server is being used to communicate between services.
  -  Data for each service is held in either a Mongo database or Redis
  -  The entire app is deployed and runs in Docker containers executed in a Kubernetes cluster
  -  On the frontend NextJS is being used along with React to display the content faster and for better SEO. 
  -  For payments StripeJS is being used.
  -  Limited access to APIs using JWT-based authentication
  -  Comprehensive test coverage to ensure each services works as designed
  -  A production ready workflow to automate deployment from github pull requests, to automatic test execution, build and deployment on Digital Ocean cloud.
