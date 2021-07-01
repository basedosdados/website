import os

import ckan.logic as logic
import requests

ValidationError = logic.ValidationError


def bd_subscribe_on_newsletter(context, data_dict):
    """Subscribe email on Hubspot newsletter

    :param email: quantity of results
    :type email: string

    :returns: Hubspot API result
    """

    try:
        email = data_dict["email"]
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    try:
        HUBSPOT_API_KEY = os.environ["HUBSPOT_API_KEY"]
        HUBSPOST_SUBSCRIPTION_ID = os.environ["HUBSPOT_SUBSCRIPTION_ID"]
    except KeyError as e:
        raise ValidationError(f"{e} environment variable not found")

    url = "https://api.hubapi.com/communication-preferences/v3/subscribe"

    data = f'{{"emailAddress":"{email}",'
    data += f'"subscriptionId":"{HUBSPOST_SUBSCRIPTION_ID}",'
    data += f'"legalBasis":"LEGITIMATE_INTEREST_PQL",'
    data += f'"legalBasisExplanation":"User subscribed on homepage"}}'

    headers = {"accept": "application/json", "content-type": "application/json"}

    params = {"hapikey": HUBSPOT_API_KEY}

    response = requests.post(url, data=data, headers=headers, params=params)
    response = response.json()

    if response["status"] == "error":
        raise ValidationError(response["message"])

    return response
