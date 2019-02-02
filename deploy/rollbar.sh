ACCESS_TOKEN=$1
ENVIRONMENT=production
LOCAL_USERNAME=`whoami`
REVISION=`git rev-parse --verify HEAD`
curl https://api.rollbar.com/api/1/deploy/ \ 
  -F access_token=$ACCESS_TOKEN \ 
  -F environment=$ENVIRONMENT \ 
  -F revision=$REVISION \ 
  -F local_username=$LOCAL_USERNAME