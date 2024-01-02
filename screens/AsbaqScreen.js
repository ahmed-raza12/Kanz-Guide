import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const AsbaqScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
      <Text style={{color: "#000", fontFamily: "JameelNoori", textAlign: "center", padding: 20, fontSize: 20}}>
        اس ٹیب میں مختلف مضامین کے آسان اسباق شامل کئے جائیں گے۔ فی الوقت نحو، بلاغت اور اصول حدیث کے اسباق پر کام جاری ہے۔ ان اسباق کی خصوصیت یہ ہے کہ یہ تمام درجات کے طلباء کیلئے مفید ہوں گے اور ہر سبق کے آخر میں اس کی مشق بھی ہوگی۔
        </Text>
    </View>
  );
};

export default AsbaqScreen;
