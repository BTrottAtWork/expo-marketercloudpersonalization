import { StyleSheet } from "react-native";
import { StandardDataCampaignStyles } from "./types";

const styles: Record<string, Record<string, any>> = {
    default: {
        light: {
            container: {
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                borderRadius: 7,
                backgroundColor: "#D2F1FD", // CORE_SKY_BLUE_3
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 25,
                paddingBottom: 25,
                marginTop: 10,
                marginRight: 15,
                marginLeft: 15,
            },
            messageContainer: {
                flex: 0.9,
                flexDirection: "column",
            },
            actionContainer: {
                flex: 0.1,   
            },
            action:  {
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
            },
            title: {
                color: "black",
                fontSize: 25,
            },
            dismiss: {
                position: "absolute",
                top: 0,
                left: 0,
                height: 40,
                width: 40,
                padding: 7,
            },
            body: {
                color: "black",
                fontSize: 16,
            },
            linkLabel: {
                color: "#0076CF",
                marginTop: 20,
                fontSize: 16,
                fontWeight: "bold",
            },
            button: {
                borderRadius: 100,
                alignItems: "center",
                borderColor: "#0076CF",
                borderWidth: 2,
                backgroundColor: "white",
                padding: 10,
                paddingRight: 20,
                paddingLeft: 20,
            },
            buttonContainer: {
                display: "flex",
                flexDirection: "row",
                flex: 0,
                marginTop: 20,
            },
            buttonLabel: {
                color: "#0076CF",
                fontSize: 16,
                fontWeight: "bold",
            },
        },
        dark: {

        } 
    }
}

export default (variant: string, scheme: string): StandardDataCampaignStyles => StyleSheet.create<StandardDataCampaignStyles>(styles[variant][scheme]);