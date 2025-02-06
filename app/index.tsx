import React, { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Card,
  Chip,
  DataTable,
  Modal,
  Portal,
  TextInput,
  ToggleButton,
  Text,
} from "react-native-paper";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    description: "Center the cells and headers in the DataTable.",
    price: 1000,
    type: "cash-out",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description: "Center the cells and headers in the DataTable.",
    price: 2000,
    type: "cash-in",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description: "Center the cells and headers in the DataTable.",
    price: 3000,
    type: "cash-out",
  },
];

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [modalType, setModalType] = useState("cash-in");

  const [transactions, setTransactions] = useState(DATA);

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === "cash-in") {
        return acc + curr.price;
      } else {
        return acc - curr.price;
      }
    }, 0);
  }, [transactions]);

  const totalCashIn = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === "cash-in") {
        return acc + curr.price;
      }
      return acc;
    }, 0);
  }, [transactions]);

  const totalCashOut = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === "cash-out") {
        return acc + curr.price;
      }
      return acc;
    }, 0);
  }, [transactions]);

  const handleAddTransaction = () => {
    const updatedTransactions = [
      ...transactions,
      {
        id: Math.random().toString(),
        title,
        description,
        price,
        type: modalType,
      },
    ];
    setTransactions(updatedTransactions);
    AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setModalVisible(false);
  };

  useEffect(() => {
    AsyncStorage.getItem("transactions").then((data) => {
      if (data) {
        setTransactions(JSON.parse(data));
      }
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
      }}
    >
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            padding: 20,
            alignItems: "center",
          }}
        >
          <Card style={{ width: "100%", borderRadius: 12, elevation: 4 }}>
            <Card.Content>
              <ToggleButton.Row
                onValueChange={(value) => setModalType(value)}
                value={modalType}
                style={{ marginBottom: 16 }}
              >
                <ToggleButton
                  style={{
                    backgroundColor:
                      modalType === "cash-in" ? "green" : "#546373",
                    flex: 1,
                  }}
                  value="cash-in"
                  icon={() => <Text style={{ color: "white" }}>Cash In</Text>}
                />
                <ToggleButton
                  style={{
                    backgroundColor:
                      modalType === "cash-out" ? "red" : "#546373",
                    flex: 1,
                  }}
                  value="cash-out"
                  icon={() => <Text style={{ color: "white" }}>Cash Out</Text>}
                />
              </ToggleButton.Row>

              <TextInput
                label="Title"
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Description"
                value={description}
                onChangeText={(text) => setDescription(text)}
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Price"
                value={price.toString()}
                onChangeText={(text) => setPrice(Number(text))}
                keyboardType="numeric"
                style={{ marginBottom: 16 }}
              />

              <Button mode="contained" onPress={handleAddTransaction}>
                Add {modalType === "cash-in" ? "Income" : "Expense"}
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
      <View
        style={{
          flex: 1,
          gap: 3,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Chip onPress={() => console.log("All")}>All</Chip>
        <Chip onPress={() => console.log("Pressed")}>Daily</Chip>
        <Chip onPress={() => console.log("Pressed")}>Weekly</Chip>
        <Chip onPress={() => console.log("Pressed")}>Yearly</Chip>
      </View>
      <SafeAreaView
        style={{
          flex: 6.5,
        }}
      >
        <FlatList
          data={transactions}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              description={item.description}
              price={item.price}
              type={item.type}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <View style={{ flex: 1.5 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            flexDirection: "row",
          }}
        >
          <Button
            style={{ flex: 1 }}
            mode="contained"
            onPress={() => {
              setModalType("cash-in");
              setModalVisible(true);
            }}
          >
            Income
          </Button>
          <Button
            style={{ flex: 1 }}
            mode="contained"
            onPress={() => {
              setModalType("cash-out");
              setModalVisible(true);
            }}
          >
            Expense
          </Button>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ justifyContent: "center" }}>
              <Text style={{ color: "green" }}>Total Cash In </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ justifyContent: "center" }}>
              <Text style={{ color: "red" }}>Total Cash Out </Text>
            </DataTable.Title>
            <DataTable.Title numeric style={{ justifyContent: "center" }}>
              Balance
            </DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell
              numeric
              style={{ justifyContent: "center", flex: 1 }}
            >
              <Text style={{ color: "green" }}>{totalCashIn}</Text>
            </DataTable.Cell>
            <DataTable.Cell
              numeric
              style={{ justifyContent: "center", flex: 1 }}
            >
              <Text style={{ color: "red" }}>{totalCashOut}</Text>
            </DataTable.Cell>
            <DataTable.Cell
              numeric
              style={{ justifyContent: "center", flex: 1 }}
            >
              {balance}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    </View>
  );
}

const Item = ({
  title,
  description,
  price,
  type,
}: {
  title: string;
  description: string;
  price: number;
  type: string;
}) => (
  <Card style={{ margin: 5 }}>
    <Card.Content>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>{title}</Text>
          <Text>{description}</Text>
        </View>
        <View>
          <Text style={{ color: type === "cash-in" ? "green" : "red" }}>
            {type === "cash-in" ? "+" + price : "-" + price}
          </Text>
        </View>
      </View>
    </Card.Content>
  </Card>
);
