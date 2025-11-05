#!/bin/bash
sed -n '71,74p' /workspace/.github/workflows/prtest.yml > /workspace/extracted_text.txt
cat /workspace/extracted_text.txt