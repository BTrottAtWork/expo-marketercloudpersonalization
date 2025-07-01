import { StyleSheet } from "react-native";

const styles: Record<string, Record<string, any>> = {
    default: {
        light: {

        },
        dark: {

        } 
    }
}

export default (variant: string, scheme: string) => StyleSheet.create(styles[variant][scheme]);