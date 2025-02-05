import React, { useMemo, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import {
  Button,
  Chip,
  DataTable,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
  ToggleButton,
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
  // const [type, setType] = useState("cash-in");
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

  function hideModal(): void {
    setModalVisible(false);
  }
  function showModal(): void {
    setModalVisible(true);
  }

  function handleAddTransaction() {
    // Add transaction logic here
    setTransactions((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        title,
        description,
        price,
        type: modalType,
      },
    ]);
    console.log({ title, description, price, type: modalType });
    hideModal();
  }

  return (
    <PaperProvider>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 10,
          // alignItems: "center",
        }}
      >
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
          >
            <ToggleButton.Row
              onValueChange={(value) => setModalType(value)}
              value={modalType}
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
                  backgroundColor: modalType === "cash-out" ? "red" : "#546373",
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
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              label="Price"
              value={price.toString()}
              onChangeText={(text) => setPrice(Number(text))}
              keyboardType="numeric"
            />
            <Button mode="contained" onPress={handleAddTransaction}>
              Add {modalType === "cash-in" ? "Income" : "Expense"}
            </Button>
          </Modal>
        </Portal>
        <View
          style={{
            flex: 1,
            backgroundColor: "red",
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
            backgroundColor: "blue",
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
        <View style={{ flex: 1.5, backgroundColor: "green" }}>
          <View
            style={{
              // flex: 1,
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
                showModal();
              }}
            >
              Income
            </Button>
            <Button
              style={{ flex: 1 }}
              mode="contained"
              onPress={() => {
                setModalType("cash-out");
                showModal();
              }}
            >
              Expense
            </Button>
          </View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ justifyContent: "center" }}>
                Total Cash In
              </DataTable.Title>
              <DataTable.Title numeric style={{ justifyContent: "center" }}>
                Total Cash Out
              </DataTable.Title>
              <DataTable.Title numeric style={{ justifyContent: "center" }}>
                Balance
              </DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell numeric style={{ justifyContent: "center" }}>
                {totalCashIn}
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ justifyContent: "center" }}>
                {totalCashOut}
              </DataTable.Cell>
              <DataTable.Cell numeric style={{ justifyContent: "center" }}>
                {balance}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </View>
      </View>
    </PaperProvider>
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
  <View
    style={{
      flex: 1,
      backgroundColor: "yellow",
      justifyContent: "space-between",
      flexDirection: "row",
      marginVertical: 5,
      padding: 10,
    }}
  >
    <View>
      <Text style={{ fontWeight: "bold" }}>{title}</Text>
      <Text>{description}</Text>
    </View>
    <View>
      <Text style={{ color: type === "cash-in" ? "green" : "red" }}>
        {type === "cash-in" ? "+" : "-"} {price}
      </Text>
    </View>
  </View>
);
