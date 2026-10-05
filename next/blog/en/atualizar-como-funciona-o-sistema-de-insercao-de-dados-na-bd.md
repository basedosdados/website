---
title: How does the data ingestion system at Data Basis work?
description: >-
  A look at our data ingestion infrastructure, and how contributing to it can
  strengthen your portfolio
slug: how-our-data-ingestion-system-works
date:
  created: "2021-05-28"
authors:
  - name: Vinicius
    social: https://github.com/vncsna
    role: Author
  - name: Fernanda
    social: https://github.com/fernandascovino
    role: Author
  - name: Diego
    social: https://github.com/d116626
    role: Author
  - name: João
    social: https://github.com/JoaoCarabetta
    role: Author
  - name: Caio
    social: https://github.com/Hellcassius
    role: Author
  - name: Giovane Caruso
    social: https://medium.com/@giovanecaruso
    role: Adaptation and editing
thumbnail: /blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg
categories: []
medium_slug: >-
  https://medium.com/@basedosdados/como-funciona-o-sistema-de-inser%C3%A7%C3%A3o-de-dados-na-bd-61a0fe05c5d5
published: false
---

## TL;DR

This article explains how the data ingestion infrastructure at Data Basis works, and how contributing to our mission of universal data access can strengthen your portfolio as a data scientist or developer.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_0.jpg" caption="Photo by [Riho Kroll](https://unsplash.com/@rihok) on [Unsplash](https://unsplash.com/)"/>

## The infrastructure

The Data Basis infrastructure team is responsible for the data ingestion tooling — everything from upload through to making data available in production — for data access via the Python and R packages, and for our [website](/). The team currently works across several fronts, including rebuilding the site and putting automated checks and balances in place.

We try to simplify and automate every step, starting with [uploading data](https://basedosdados.org/docs/colab_data) and bringing it into the **Experimentation Environment**. At that point a contributor can add data to their own Google cloud, clean and process it, then create the local tables using the command line interface the infrastructure team built. Finally, the dataset can be submitted for review by opening a pull request on [GitHub](https://github.com/basedosdados/sdk/pulls).

Once the review pull request is open, the checks-and-balances system takes over, with the data team verifying the quality of the data and its metadata. This step is central to maintaining the data quality that sets Data Basis apart. The infrastructure team works to automate as much of that review as possible, validating metadata such as column names and descriptions, and data types such as primary keys.

After those checks pass, the ingestion pull request is approved and the data enters the **Production Environment**. It can then be accessed through any of our tools, such as the Python and R packages, or directly in BigQuery.

<Image src="/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd/image_1.png"/>

Alongside the ingestion work, the infrastructure team works with the website team on rebuilding our platform to offer a modern interface. We wrote an [article](/blog/um-site-feito-a-varias-maos) on how we organised a collaborative project to build a new platform that makes working with data easier still.

## Contributing data

On the way to becoming a data analyst or developer, breaking into the job market is hard. There is often no balance between study and practical application, or only toy data analysis. Raise your hand if you have never been stuck on datasets like Titanic or Iris. Those datasets are a reasonable way to learn a new method or tool, but the knowledge does not transfer to the real world.

A good alternative for working with real data and improving your portfolio is helping Data Basis with data ingestion. At minimum you will handle data capture, ideally automated, along with architecture and cleaning. You will also work with the everyday tools of a data scientist: command line interfaces, YAML and BigQuery. That experience can make the difference when entering the job market.

We describe the process in detail in [Contributing data to Data Basis](https://basedosdados.org/docs/colab_data). In short it has four parts. First you tell us you are interested. Then you clean and process the data you intend to upload. Next you upload it to your personal BigQuery. Finally, you submit it for review.

## Contributing to the infrastructure

Another way to contribute and build your portfolio, this time as a developer, is working on the Data Basis infrastructure.

It starts with a conversation, either in the infrastructure chat or at the Monday 7pm meetings, both on the infrastructure channels on [Discord](https://discord.gg/huKWpsVYx4). From there we can pick a feature or problem to work on, if you have not already found something among the open [issues](https://github.com/basedosdados/sdk/issues).

How can you help? **Here are some ideas:**

- Adding new datasets
- Reviewing data submissions
- Improving the Python package and building new features for it
- Improving the R package and building new features for it
- Adding automated data checks
- Adding automated metadata checks
- Building new features for the site

**Has our project helped you in some way?** We are a nonprofit organisation that depends on the support of our community. Here is how to contribute:

- [Support the project](https://apoia.se/basedosdados)
- [Become a data contributor at Data Basis](https://basedosdados.org/docs/colab_data)
- [Contribute to our packages](https://github.com/basedosdados/mais)
- Share us on social media!
