﻿// Copyright (c) Microsoft. All rights reserved.

using System.Collections.Generic;

// ReSharper disable once CheckNamespace
namespace Microsoft.SemanticWorkbench.Connector;

public class DebugInfo : Dictionary<string, object?>
{
    public DebugInfo()
    {
    }

    public DebugInfo(string key, object? info)
    {
        this.Add(key, info);
    }
}