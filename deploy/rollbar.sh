ACCESS_TOKEN=$1
ENVIRONMENT=production
REVISION=`git rev-parse --verify HEAD`
req = '{"access_token":'
req += $ACCESS_TOKEN
req += ',"environment":"production","revision":"'
req += $REVISION
req += '"}'
curl --request POST \ 
  --url https://api.rollbar.com/api/1/deploy/ \
  --data $req
