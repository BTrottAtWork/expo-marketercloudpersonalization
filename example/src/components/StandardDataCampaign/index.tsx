import { Text, Image, View, useColorScheme, TouchableOpacity, Modal, ImageBackground, Animated} from "react-native";
import { useState, useEffect, useMemo, ReactElement } from "react";
import ctaStyles from "./styles-cta";
import bannerStyles from "./styles-banner";
import cardStyles from "./styles-card";
import cardWithImageStyles from "./styles-card-with-bg-image";
import modalStyles from "./styles-modal";
import Icon from 'react-native-vector-icons/EvilIcons';
import MCP from 'expo-marketercloudpersonalization';
import { StandardDataCampaignComponentProps, StandardDataCampaignProps, StandardDataCampaignStyles } from "./types";

/**
 * Standard nudge container/handler for custom nudges 
 * 
 */  
const useStylesheet = (ss: (v: string, s: string) => StandardDataCampaignStyles, variant: string) => {
  const scheme = useColorScheme();
  const [styles, setStyles] = useState<StandardDataCampaignStyles>();
  useEffect(() => {
    if(scheme) {
      setStyles(ss(variant || "default", scheme));
    }
  }, [scheme]);
  return styles;
}

const CTA = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(ctaStyles, props.styleVariant);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if(styles && visible) {
      console.log(`track impression ${props.campaignId}`);
      MCP.trackImpression(props.campaignId);
    }
  }, [styles, visible]);
   
  if(!styles || !visible) {
    return null;
  } 

  return (
    <View style={styles.container}>
      {!!props.dismissible && (
        <TouchableOpacity style={styles.dismiss} onPress={() => {
          console.log(`track dismissal for ${props.campaignId}`);
          MCP.trackDismissal(props.campaignId);
          setVisible(false);
        }}>
          <Icon size={20} name="close" />
        </TouchableOpacity>
      )}
      <View style={styles.messageContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.body}>{props.body}</Text>
      </View>

      {props.actionLink && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.action} onPress={() => {
            console.log(`track clickthrough for ${props.campaignId}`);
            MCP.trackClickthrough(props.campaignId);
            props.onAction && props.onAction(props.actionLink || "");
          }}>
            <Icon size={40} name="chevron-right" />  
          </TouchableOpacity>
        </View>
      )}
      
    </View>

  );
}

const Card_off = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(cardStyles, props.styleVariant);
  const [visible, setVisible] = useState(true);

  const cardAnimation = useMemo(() => new Animated.Value(-500), []);
  useEffect(() => {
    Animated.spring(cardAnimation, {
      toValue: 0,
      friction: 4,
      tension: 3,
      useNativeDriver: true,
    }).start();
  }, [cardAnimation]);

  useEffect(() => {
    if(styles && visible) {
      console.log(`track impression ${props.campaignId}`);
      MCP.trackImpression(props.campaignId);
    }
  }, [styles, visible]);

  if(!styles || !visible) {
    return null;
  }

  return (
    <Animated.View style={{...styles.container, transform: [{translateY: cardAnimation}]}}>
          {!!props.dismissible && (
            <TouchableOpacity style={styles.dismiss} onPress={() => {
              console.log(`track dismissal for ${props.campaignId}`);
              MCP.trackDismissal(props.campaignId);
              setVisible(false);
            }}>
              <Icon size={20} name="close" />
            </TouchableOpacity>
            
          )}

          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.body}>{props.body}</Text>

          {props.actionType === "link" && props.actionLabel && props.actionLink && (
            <Text style={styles.linkLabel} 
              onPress={() => {
                console.log(`track clickthrough for ${props.campaignId}`);
                MCP.trackClickthrough(props.campaignId);
                props.onAction && props.onAction(props.actionLink || "");
              }}>
                {props.actionLabel}
            </Text>
          )}

          {props.actionType === "button" && props.actionLabel && props.actionLink && (
            <TouchableOpacity style={styles.buttonContainer} onPress={ () => {
              console.log(`track clickthrough for ${props.campaignId}`);
              MCP.trackClickthrough(props.campaignId);
              props.onAction && props.onAction(props.actionLink || "");
            } }>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>{props.actionLabel}</Text>
              </View>
            </TouchableOpacity>
          )}

    </Animated.View>
  );
}

const Card = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(cardStyles, props.styleVariant);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if(styles && visible) {
      console.log(`track impression ${props.campaignId}`);
      MCP.trackImpression(props.campaignId);
    }
  }, [styles, visible]);

  if(!styles || !visible) {
    return null;
  }

  return (
    <View style={styles.container}>
          {!!props.dismissible && (
            <TouchableOpacity style={styles.dismiss} onPress={() => {
              console.log(`track dismissal for ${props.campaignId}`);
              MCP.trackDismissal(props.campaignId);
              setVisible(false);
            }}>
              <Icon size={20} name="close" />
            </TouchableOpacity>
            
          )}

          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.body}>{props.body}</Text>

          {props.actionType === "link" && props.actionLabel && props.actionLink && (
            <Text style={styles.linkLabel} 
              onPress={() => {
                console.log(`track clickthrough for ${props.campaignId}`);
                MCP.trackClickthrough(props.campaignId);
                props.onAction && props.onAction(props.actionLink || "");
              }}>
                {props.actionLabel}
            </Text>
          )}

          {props.actionType === "button" && props.actionLabel && props.actionLink && (
            <TouchableOpacity style={styles.buttonContainer} onPress={ () => {
              console.log(`track clickthrough for ${props.campaignId}`);
              MCP.trackClickthrough(props.campaignId);
              props.onAction && props.onAction(props.actionLink || "");
            } }>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>{props.actionLabel}</Text>
              </View>
            </TouchableOpacity>
          )}

    </View>
  );
}



const CardWithBGImage = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(cardWithImageStyles, props.styleVariant);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if(styles && visible) {
      console.log(`track impression ${props.campaignId}`);
      MCP.trackImpression(props.campaignId);
    }
  }, [styles, visible]);

  if(!styles || !visible) {
    return null;
  }

  return (
    // <View style={styles.container}>
    <View style={styles.container}>
      <ImageBackground 
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",

          //needs to be on container when bg image not used
          borderRadius: 7,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        imageStyle={{ 
          height: 75,
          width: 75,
          resizeMode: "cover", 
          position: "absolute",
          left: undefined,
          bottom: undefined,
          right: 45, // 45 off right when dismiss is present
          top: 0, 
        }} 
          source={{uri: "https://legacy.reactjs.org/logo-og.png"}}   >
          
      
          {!!props.dismissible && (
            <TouchableOpacity style={styles.dismiss} onPress={() => {
              console.log(`track dismissal for ${props.campaignId}`);
              MCP.trackDismissal(props.campaignId);
              setVisible(false);
            }}>
              <Icon size={20} name="close" />
            </TouchableOpacity>
            
          )}

          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.body}>{props.body}</Text>

          {props.actionType === "link" && props.actionLabel && props.actionLink && (
            <Text style={styles.linkLabel} 
              onPress={() => {
                console.log(`track clickthrough for ${props.campaignId}`);
                MCP.trackClickthrough(props.campaignId);
                props.onAction && props.onAction(props.actionLink || "");
              }}>
                {props.actionLabel}
            </Text>
          )}

          {props.actionType === "button" && props.actionLabel && props.actionLink && (
            <TouchableOpacity style={styles.buttonContainer} onPress={ () => {
              console.log(`track clickthrough for ${props.campaignId}`);
              MCP.trackClickthrough(props.campaignId);
              props.onAction && props.onAction(props.actionLink || "");
            } }>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>{props.actionLabel}</Text>
              </View>
            </TouchableOpacity>
          )}

      </ImageBackground>

    </View>
  );
}
const Banner = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(bannerStyles, props.styleVariant);

  if(!styles) {
    return null;
  }

  return (
    <CTA {...{...props, actionType: "cta"}} />
  );
}

const _Modal = (props: StandardDataCampaignComponentProps): ReactElement | null => {
  const styles = useStylesheet(modalStyles, props.styleVariant);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if(styles && visible) {
      console.log(`track impression ${props.campaignId}`);
      MCP.trackImpression(props.campaignId);
    }
  }, [styles, visible]);

  if(!styles) {
    return null;
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>

          {!!props.dismissible && (
            <TouchableOpacity style={styles.dismiss} onPress={() => {
              console.log(`track dismissal for ${props.campaignId}`);
              MCP.trackDismissal(props.campaignId);
              setVisible(false);
            }}>
              <Icon size={20} name="close" />
            </TouchableOpacity>
            
          )}

          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.body}>{props.body}</Text>

          {props.actionType === "link" && props.actionLabel && props.actionLink && (
            <Text style={styles.linkLabel} 
              onPress={() => {
                console.log(`track clickthrough for ${props.campaignId}`);
                MCP.trackClickthrough(props.campaignId);
                props.onAction && props.onAction(props.actionLink || "");
              }}>
                {props.actionLabel}
            </Text>
          )}

          {props.actionType === "button" && props.actionLabel && props.actionLink && (
            <View style={styles.row}>
              <TouchableOpacity style={styles.buttonContainer} onPress={ () => {
                console.log(`track clickthrough for ${props.campaignId}`);
                MCP.trackClickthrough(props.campaignId);
                props.onAction && props.onAction(props.actionLink || "");
              } }>
                <View style={styles.button}>
                  <Text style={styles.buttonLabel}>{props.actionLabel}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal>
  )
}

export default (props: StandardDataCampaignProps): ReactElement | null => {

  console.log(`render ${JSON.stringify(props, null, 2)}`);

  const action = props.onAction ? props.onAction : () => {};

  if(props.actionType === "cta") {
    return <CTA campaignId={props.campaignId} onAction={action} {...props.data} />;
  }

  switch(props.data.type) {
    case "banner":
      return <Banner campaignId={props.campaignId} onAction={action} {...props.data} />;
    case "card":
      return <Card campaignId={props.campaignId} onAction={action} {...props.data} />;
    case "modal":
      return <_Modal campaignId={props.campaignId} onAction={action} {...props.data} />;
    default:
      return null;
  }
};