import json
import os

import ckan.logic as logic
import requests

ValidationError = logic.ValidationError


def bd_newsletter_subscribe(context, data_dict):
    """Subscribe email on Hubspot newsletter

    :param email: user email
    :type email: string

    :returns: Hubspot API result
    """

    # Validation -----------------------

    try:
        email = data_dict["email"]
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    try:
        HUBSPOT_API_KEY = os.environ["HUBSPOT_API_KEY"]
    except KeyError as e:
        raise ValidationError(f"{e} environment variable not found")

    # Request --------------------------

    url = "https://api.hubapi.com/contacts/v1/contact/"

    data = json.dumps(
        {
            "properties": [
                {
                    "property": "email",
                    "value": email,
                },
                {
                    "property": "newsletter",
                    "value": "Sim",
                }
            ]
        }
    )

    headers = {"accept": "application/json", "content-type": "application/json"}

    params = {"hapikey": HUBSPOT_API_KEY}

    # Response -------------------------

    response = requests.post(url, data=data, headers=headers, params=params)
    response = response.json()

    if "status" in response:
        raise ValidationError(response["message"])

    return response
