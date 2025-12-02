import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../api";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    async function load() {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed loading users", err);
        }
    }

    async function handleDelete(id) {
        await deleteUser(id);
        load();
    }

    async function handleSave(id) {
        await updateUser(id, { name: editName });
        setEditId(null);
        load();
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="card">
            <h2>Users</h2>

            {users.map((u) => (
                <div className="list-row" key={u.id}>
                    {editId === u.id ? (
                        <>
                            <input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <button onClick={() => handleSave(u.id)}>Save</button>
                            <button className="danger" onClick={() => setEditId(null)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
              <span>
                <strong>{u.name}</strong>
                <div className="muted">{u.id}</div>
              </span>

                            <button
                                onClick={() => {
                                    setEditId(u.id);
                                    setEditName(u.name);
                                }}
                            >
                                Edit
                            </button>

                            <button className="danger" onClick={() => handleDelete(u.id)}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
