**Node.js Web Application on AWS**

This is a RESTful APIs-based web application built with Node.js that offers user registration and file upload functionalities to an S3 bucket. The stack consists of Node.js, Express.js, PostgreSQL, and AWS services.

**Key Components:**

1. **Custom AMI with Packer:** EC2 instances are built using custom Amazon Machine Images (AMI) created with Packer. This allows for consistent and efficient instance provisioning.

2. **Network and Resource Setup:** The setup of the network and resource creation is automated using AWS CloudFormation, AWS CLI, and shell scripts. This ensures the infrastructure is defined as code for repeatability and consistency.

3. **Auto Scaling with ELB:** Instances are automatically scaled using Elastic Load Balancers (ELB) to handle web traffic efficiently. The ELB distributes incoming traffic across multiple instances to maintain high availability and reliability.

4. **Serverless Mail Notifications:** A serverless application using AWS Simple Email Service (SES) and Simple Notification Service (SNS) is implemented to send email notifications to users upon registration. This architecture is cost-effective and scalable.

5. **Automated Testing:** The application is automatically tested using tools like Mocha or Jest to ensure code quality and functionality.

6. **Continuous Deployment:** A GitHub workflow is set up to automate the deployment process. Whenever a pull request is merged, the application is automatically deployed to the AWS environment. This promotes a streamlined and efficient development workflow.
