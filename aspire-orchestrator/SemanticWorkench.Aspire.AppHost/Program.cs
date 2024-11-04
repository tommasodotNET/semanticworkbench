using CommunityToolkit.Aspire.Hosting.Uvicorn;

var builder = DistributedApplication.CreateBuilder(args);


var workbenchService = builder.AddUvicornApp("workbenchservice",
                                            projectDirectory: Path.Combine("..", "..", "workbench-service"),
                                            scriptPath: "start-semantic-workbench-service")
    .WithHttpEndpoint(env: "PORT");

var workbenchServiceEndpoint = workbenchService.GetEndpoint("http");

var dotnetAgent3 = builder.AddProject<Projects.dotnet_03_simple_chatbot>("agent3")
    .WithReference(workbenchServiceEndpoint)
    .WaitFor(workbenchService);
dotnetAgent3.WithReference(dotnetAgent3);

// var pythonAgent1 = builder.AddUvicornApp("pythonAgent",
//                                         projectDirectory: Path.Combine("..", "..", "examples", "python", "python-01-echo-bot"),
//                                         scriptPath: "start-semantic-workbench-assistant",
//                                         scriptArgs: ["assistant.chat:app"])
//     .WithHttpEndpoint(env: "ASSISTANT__PORT")
//     .WithReference(workbenchServiceEndpoint);


builder.AddViteApp("workbenchapp", workingDirectory: Path.Combine("..", "..", "workbench-app"), packageManager: "pnpm")
    .WithPnpmPackageInstallation()
    .WithHttpsEndpoint(env: "PORT")
    // .WithReference(workbenchServiceEndpoint)
    .WithEnvironment(name: "VITE_SEMANTIC_WORKBENCH_SERVICE_URL", workbenchServiceEndpoint)
    .WaitFor(workbenchService)
    .PublishAsDockerFile();

builder.Build().Run();