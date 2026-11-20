cd Backend
copy .env.example .env
$key = python -c "import secrets; print(secrets.token_hex(32))"
Add-Content .env "`nSECRET_KEY=$key"
