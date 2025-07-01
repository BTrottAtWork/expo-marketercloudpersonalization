import { StyleSheet } from "react-native";

const styles: Record<string, Record<string, any>> = {
    default: {
        light: {
            mainContainer: {
                display: "flex",
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(52, 52, 52, 0.6)",
            },
            contentContainer: {
                flex: 0,
                padding: 25,
                backgroundColor: "white",

            },
            title: {
                color: "black",
                fontSize: 25,
            },
            dismiss: {
                position: "absolute",
                top: 0,
                right: 0,
                height: 40,
                width: 40,
                padding: 7,
            },
            body: {
                color: "black",
                fontSize: 16,
                marginTop: 10,
            },
            linkLabel: {
                color: "#0076CF",
                marginTop: 20,
                fontSize: 16,
                fontWeight: "bold",
            },

            row: {
                display: "flex",
                alignItems: "center",
            },

            buttonContainer: {
                marginTop: 20,
                flex: 0,
            },
            button: {
                flex: 0,
                borderRadius: 100,
                alignItems: "center",
                backgroundColor: "#0076CF",
                padding: 10,
                paddingRight: 20,
                paddingLeft: 20,
            },
            buttonLabel: {
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
            },
        },
        dark: {

        } 
    }
}

export default (variant: string, scheme: string) => StyleSheet.create(styles[variant][scheme]);