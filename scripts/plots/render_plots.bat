@echo off
setlocal
set SCRIPT_DIR=%~dp0
python "%SCRIPT_DIR%render_plots.py" %*
endlocal
