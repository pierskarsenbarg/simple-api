import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

new PolicyPack("lambda", {
    policies: [
        {
            name: "lambda-architecture",
            description: "All lambdas should use the arm64 architecture",
            enforcementLevel: "mandatory",
            validateResource: validateResourceOfType(aws.lambda.Function, (lambda, args, reportViolation) => {
                if (lambda.architectures?.find(x => x != "arm64")) {
                    reportViolation(
                        "Lambdas should use the arm64 architecture, not the x86 one"
                    )
                }
            })
        },
        {
            name: "lambda-node-versions",
            description: "Lambdas should use correct versions of Java SDK",
            enforcementLevel: "advisory",
            validateResource: validateResourceOfType(aws.lambda.Function, (lambda, args, reportViolation) => {

                const validNodeJSVersions = ["nodejs18.x", "nodejs16.x"]; // not java8.al2 for demo purposes

                if(lambda.runtime != undefined) {
                    if (validNodeJSVersions.indexOf(lambda.runtime) === -1) {
                        reportViolation("Lambda NodeJS version must be an approved version.")
                    }
                }
                
            })
        }
    ],
});
