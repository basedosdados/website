import os

import requests


def bd_subscribe_on_newsletter(context, data_dict):
    """Subscribe email on Hubspot newsletter

    :param email: quantity of results
    :type email: string

    :returns: Hubspot API result
    """

    HUBSPOT_API_KEY = os.environ.get("HUBSPOT_API_KEY", 0)
    HUBSPOST_SUBSCRIPTION_ID = os.environ.get("HUBSPOST_SUBSCRIPTION_ID", 0)

    url = "https://api.hubapi.com/communication-preferences/v3/subscribe"

    payload = f'{{"emailAddress":{data_dict["email"]},'
    payload += f'"subscriptionId":"{HUBSPOST_SUBSCRIPTION_ID}",'
    payload += f'"legalBasis":"LEGITIMATE_INTEREST_PQL",'
    payload += f'"legalBasisExplanation":"User subscribed on homepage"}}'

    headers = {"accept": "application/json", "content-type": "application/json"}

    querystring = {"hapikey": HUBSPOT_API_KEY}

    response = requests.post(url, data=payload, headers=headers, params=querystring)

    return response.text
