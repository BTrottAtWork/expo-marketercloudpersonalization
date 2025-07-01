import MCP, {useDataCampaign} from 'expo-marketercloudpersonalization';
import React, {useRef,useEffect, useCallback} from "react";
import {
  Button,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import { NavigationContainer, useNavigationContainerRef, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import StandardDataCampaign from "./src/components/StandardDataCampaign";
import { StandardDataCampaignData } from './src/components/StandardDataCampaign/types';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
    const routeNameRef = useRef("");

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                const currentRouteName: string = navigationRef?.getCurrentRoute()?.name || "";
                routeNameRef.current = currentRouteName;
                console.log("View " + currentRouteName);
                MCP.trackAction(`View ${currentRouteName}`);
            }}
            onStateChange={async () => {
                /*
                 * If screen changes, call native module to send event to Interaction Studio
                 */
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef?.getCurrentRoute()?.name || "";
                if (previousRouteName !== currentRouteName) {
                    console.log("View " + currentRouteName);
                    MCP.trackAction(`View ${currentRouteName}`);
                }
                routeNameRef.current = currentRouteName;
            }}
        >
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Product" component={ProductScreen} />
              <Stack.Screen name="Category" component={CategoryScreen} />
              <Stack.Screen name="increase_contribution" component={IncreaseContributionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

/**
 * Category screen
 */
function CategoryScreen() {

  const navigation = useNavigation();
  const data = useDataCampaign<StandardDataCampaignData>(["category_modal"]);

  useEffect(() => {
    MCP.viewCategory("category abc");
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("blur", () => {
      data.clearCampaigns();
    });

    return unsub;
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>

      {data.ready && (
        <View>
          {data.campaigns.map(c => (
            <StandardDataCampaign key={`mcp_data_cpn_${c.target}`} campaignId={c.campaignId} data={c.data} />
          ))}
        </View>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack() } />
    </View>
  );
}

function IncreaseContributionScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Button title="Increase contribution rate" onPress={() => {
              console.log("Track action: userDidPropensityThing");
              MCP.trackAction("userDidPropensityThing");
              Alert.alert("Success", "Way to contribute to your retirement!", [{
                text: "Okay",
                onPress: navigation.goBack
              }]);
          }} />
          <Button title="Cancel" onPress={navigation.goBack} />
      </View>
    </ScrollView>
  );
}

/**
 * Product screen with an add to cart button
 */
function ProductScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const {ready, campaigns, clearCampaigns} = useDataCampaign<StandardDataCampaignData>(["propensity_score_20"]);
      
    const handleAction = useCallback((action: string) => {
      if(action === "myprotocol://increase_contribution") {
        navigation.navigate("increase_contribution" );
      }
    }, []);

    useEffect(() => {
      MCP.viewItem("product abc");
    }, []);

    useEffect(() => {
      const unsub = navigation.addListener("blur", () => {
        clearCampaigns();
      });

      return unsub;
    }, [navigation]);

    return (
      <ScrollView>
        {ready && (
          <View>
            {campaigns.map(c => (
              <StandardDataCampaign 
                key={`mcp_data_cpn_${c.target}`} 
                campaignId={c.campaignId} 
                data={c.data} 
                onAction={(actionLink: string): void => {
                  handleAction(actionLink);
                }}/>
            ))}
          </View>
        )}

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Button title="Add to Cart" onPress={() => {
                let productId = "abc"; // lookup product id
                const quantity = 1; // set quantity
                console.log(`addToCart: ${productId} ${quantity}`);
                MCP.addToCart(productId, quantity).then( () => {
                    Alert.alert( "", "Product has been added to cart.");
                });
            } }
            />
            <Button title="View Category" onPress={() => navigation.navigate('Category') } />
            <Button title="Go to Home" onPress={() => navigation.navigate('Home') } />
        </View>
      </ScrollView>
    );
}

/**
 * Home screen
 */
const HomeScreen = () => {   

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {

      MCP.setUserId(""); // <-- set a test user id for demonstrating functionality.

      Promise.all([
        MCP.getAccountId(),
        MCP.getAnonymousId(),
        MCP.getUserId(),
      ]).then(([accountId, anonymousId, userId]) => {
          console.log(`AccountId: ${accountId}`);
          console.log(`AnonymousId: ${anonymousId}`);
          console.log(`UserId: ${userId}`);
      });
    }, [])
    

    const topCampaigns = useDataCampaign<StandardDataCampaignData>(["home_banner_dismissible", "home_banner_cta"]);
    const bottomCampaigns = useDataCampaign<StandardDataCampaignData>(["home_card_link", "home_card_button"]);

    useEffect(() => {
      const unsub = navigation.addListener("blur", () => {
        topCampaigns.clearCampaigns();
        bottomCampaigns.clearCampaigns();
      });

      return unsub;
    }, [navigation]);


    return (
      <ScrollView style={{display: "flex"}}>

        {topCampaigns.ready && (
          <View>
            {topCampaigns.campaigns.map(c => (
              <StandardDataCampaign key={`mcp_data_cpn_${c.target}`} campaignId={c.campaignId} data={c.data} />
            ))}
          </View>
        )}

        <Button
          title="Go to Product"
          onPress={() => {
            navigation.navigate("Product");
          }}
        />

        {bottomCampaigns.ready && (
          <View>
            {bottomCampaigns.campaigns.map(c => (
              <StandardDataCampaign key={`mcp_data_cpn_${c.target}`} campaignId={c.campaignId} data={c.data} />
            ))}
          </View>
        )}

      </ScrollView>
    );
  }
