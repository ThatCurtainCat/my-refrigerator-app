import React, { useState, useEffect } from "react";

const foodEmojis = {
  vegetable: "🥦",
  fruit: "🍎",
  dairy: "🥛",
  meat: "🥩",
  other: "🍽️",
};

const MyRefrigeratorApp = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    category: "vegetable",
    area: "fridge",
    expiryDays: 0,
  });
  const [currentTab, setCurrentTab] = useState("urgent");

  useEffect(() => {
    const savedItems = localStorage.getItem("refrigeratorItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("refrigeratorItems", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.name && newItem.expiryDays > 0) {
      const newItems = [...items, { ...newItem, id: Date.now() }];
      setItems(newItems);
      setNewItem({
        name: "",
        quantity: 1,
        category: "vegetable",
        area: "fridge",
        expiryDays: 0,
      });
    }
  };

  const updateItemQuantity = (id, change) => {
    const updatedItems = items
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };

  const renderItem = (item) => {
    const isExpired = item.expiryDays < 0;
    return (
      <div
        key={item.id}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          margin: "10px 0",
          backgroundColor: "white",
          borderRadius: "5px",
        }}
      >
        <span style={{ fontSize: "24px", marginRight: "10px" }}>
          {foodEmojis[item.category]}
        </span>
        <span style={{ flexGrow: 1 }}>{item.name}</span>
        <span
          style={{ marginRight: "10px", color: isExpired ? "red" : "green" }}
        >
          {isExpired
            ? `已过期: ${Math.abs(item.expiryDays)}天`
            : `保质期: ${item.expiryDays}天`}
        </span>
        <div>
          <button
            onClick={() => updateItemQuantity(item.id, -1)}
            style={buttonStyle}
          >
            -
          </button>
          <span style={{ margin: "0 5px" }}>{item.quantity}</span>
          <button
            onClick={() => updateItemQuantity(item.id, 1)}
            style={buttonStyle}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        我的冰箱
      </h1>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {["urgent", "add", "home"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: currentTab === tab ? "#4299e1" : "#e2e8f0",
              color: currentTab === tab ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab === "urgent"
              ? "临期食材"
              : tab === "add"
              ? "新增食材"
              : "我的冰箱"}
          </button>
        ))}
      </div>
      {currentTab === "add" && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <input
            style={inputStyle}
            placeholder="名称"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="保质期（天）"
            type="number"
            value={newItem.expiryDays || ""}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                expiryDays: parseInt(e.target.value) || 0,
              })
            }
          />
          <select
            style={inputStyle}
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
          >
            <option value="vegetable">蔬菜</option>
            <option value="fruit">水果</option>
            <option value="dairy">乳制品</option>
            <option value="meat">肉类</option>
            <option value="other">其他</option>
          </select>
          <button
            onClick={addItem}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#48bb78",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            确定新增
          </button>
        </div>
      )}
      {currentTab !== "add" && <div>{items.map(renderItem)}</div>}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #e2e8f0",
  borderRadius: "5px",
};

const buttonStyle = {
  padding: "5px 10px",
  backgroundColor: "#e2e8f0",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default MyRefrigeratorApp;
