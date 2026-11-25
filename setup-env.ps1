cd Backend
$key = python -c "import secrets; print(secrets.token_hex(32))"
(Get-Content .env.example) -replace '^SECRET_KEY=.*', "SECRET_KEY=$key" | Set-Content .env
python -c "p='.env'; open(p,'wb').write(open(p,'rb').read().replace(b'\r\n',b'\n'))"
