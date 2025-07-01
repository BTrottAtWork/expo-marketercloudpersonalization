import { StyleSheet } from "react-native";

const styles: Record<string, Record<string, any>> = {
    default: {
        light: {
            container: {
                flex: 1,
                borderRadius: 7,
                backgroundColor: "#D2F1FD", // CORE_SKY_BLUE_3
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 20,
                paddingBottom: 20,
                marginRight: 15,
                marginLeft: 15,
                marginTop: 10,
            },
            svgTopRight: {
                position: "absolute",
                top: 0,
                right: 40,
            },
            svgTopLeft: {
                position: "absolute",
                top: 0,
                left: 15,
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

export default (variant: string, scheme: string): StyleSheet => StyleSheet.create(styles[variant][scheme]);