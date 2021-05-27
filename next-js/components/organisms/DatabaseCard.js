import {Card} from "../molecules/Card";
import DescriptionText from "../atoms/DescriptionText";
import {Box, HStack, Image} from "@chakra-ui/react";
import Title from "../atoms/Title";
import Subtitle from "../atoms/Subtitle";
import {Tag} from "../atoms/Tag";

function Dot({radius=1}){
    return(<Box width={radius} height={radius} borderRadius={radius * 10} backgroundColor="#6F6F6F"/>)
}

export default function DatabaseCard({name, iconUrl, organization, tags, description, size, tableNum, externalLinkNum, updatedSince, updatedAuthor, isPlus=false}){
    const databaseInfo = [];

    function getIconBoxColor(){
        if(isPlus && iconUrl) return "#3AA1EB"
        else if(!iconUrl) return "transparent"
        else return "#E5E5E5"
    }

    function getTabColor(){
        if(isPlus) return "#3AA1EB"
        else return "#E5E5E5"
    }

    function getCardIcon(){
        if(isPlus && !iconUrl) return <Image src="/img/logo_plus.png" maxWidth="90px" position="absolute" top="20px" left="-50px"/>
        return <Image src={iconUrl}/>
    }

    if(tableNum) databaseInfo.push(tableNum);
    if(externalLinkNum) databaseInfo.push(externalLinkNum + " link externo");

    return(
        <Card spacing={2} icon={getCardIcon()} tabColor={getTabColor()} iconBoxColor={getIconBoxColor()}>
            {isPlus && iconUrl ? <Image src="/img/logo_plus.png" width="80px" position="absolute" top="15px" left="30px"/> : <></>}
            <Title>{name}</Title>
            <Subtitle>{organization}</Subtitle>
            <HStack padding="15px 0px">
                {tags.map(t => <Tag>{t}</Tag>)}
            </HStack>
            <DescriptionText>
                {description}
            </DescriptionText>
            <HStack padding="15px 0px">
                {size ? <><Subtitle fontWeight="bold">{size}</Subtitle><Dot/></> : <></>}
                {databaseInfo.map((item, index) => <><Subtitle>{item}</Subtitle> {index !== databaseInfo.length -1  ? <Dot/> : <></>} </>)}
            </HStack>
            <Subtitle fontSize="16px" fontStyle="italic">Atualizado há {updatedSince} por {updatedAuthor}</Subtitle>
        </Card>
    )
}