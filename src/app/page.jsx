"use client";

import { useEffect, useState } from "react";
import { Alert, Table, Tag } from "antd";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      setLoading(true);
      const source = new EventSource("/api/orders-sse");

      source.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setOrders(data.orders);
      };
    } catch (error) {
      setError(error.response);
    } finally {
      setLoading(false);
    }
  }, []);
  const columns = [
    {
      title: "Pedido",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      className: "font-bold",
      render: (text) => (
        <Tag
          color={
            text === "Entregue"
              ? "green"
              : text === "Enviado"
              ? "blue"
              : "orange"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Ultima atualização",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (text) => {
        const date = new Date(text);
        const formatted = new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(date);

        return <span>{formatted}</span>;
      },
    },
  ];

  return (
    <div className="p-4">
      {error && <Alert message={error} type="error" />}

      <h1 className="text-center font-bold text-xl mb-4">Pedidos</h1>
      <Table
        dataSource={orders}
        columns={columns}
        className="p-12 rounded-2xl "
        bordered
        loading={loading}
      />
    </div>
  );
}
