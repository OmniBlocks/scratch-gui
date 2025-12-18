#!/bin/bash

# Fix the prtest.yml file by adding NODE_OPTIONS to the ESLint step
sed -i '402a\        env:\n          NODE_OPTIONS: --max-old-space-size=8912' /workspace/.github/workflows/prtest.yml