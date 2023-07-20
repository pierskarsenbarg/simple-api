import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";

const lambdaRole = new aws.iam.Role("simpleLambdaRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(aws.iam.Principals.LambdaPrincipal),
    managedPolicyArns: [aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole]
});

const fn = new aws.lambda.Function("simpleApiLambda", {
    role: lambdaRole.arn,
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./app")
    }),
    runtime: aws.lambda.Runtime.NodeJS18dX,
    handler: "index.handler"
});

// const lambda = new aws.lambda.CallbackFunction("simpleApiLambda", {
//     callback: async (e) => {
//         console.log(e);
//         return {
//             statusCode: 200,
//             body: JSON.stringify({message: "Hello, World!"})
//         };
//     },
//     role: lambdaRole
// });

// const api = new apigateway.RestAPI("api", {
//     routes: [
//         { path: "/date", method: "GET", eventHandler: fn },
//     ]
// });

const apigw = new aws.apigatewayv2.Api("httpApi", {
    protocolType: "HTTP",
    routeKey: "GET /",
    target: fn.invokeArn
});

const permission = new aws.lambda.Permission("permission", {
    action: "lambda:InvokeFunction",
    principal: "apigateway.amazonaws.com",
    function: fn,
});

export const endpoint = apigw.apiEndpoint;