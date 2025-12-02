import { useEffect, useState } from "react";
import {
    getDevices,
    deleteDevice,
    createDevice,
    updateDevice,
    assignDevice,
    getUsers
} from "../api";

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);

    const [newDev, setNewDev] = useState({ name: "", maxCons: 0 });
    const [editId, setEditId] = useState(null);
    const [editDev, setEditDev] = useState({ name: "", maxCons: 0 });

    const [assignUserId, setAssignUserId] = useState("");

    useEffect(() => {
        async function load() {
            const devList = await getDevices();
            const usrList = await getUsers();

            setDevices(devList);
            setUsers(usrList);
        }

        load();
    }, []);

    async function handleCreate(e) {
        e.preventDefault();
        await createDevice(newDev);
        setNewDev({ name: "", maxCons: 0 });

        // reload
        const updated = await getDevices();
        setDevices(updated);
    }

    async function handleSave(id) {
        await updateDevice(id, editDev);
        setEditId(null);

        const updated = await getDevices();
        setDevices(updated);
    }

    async function handleAssign(deviceId) {
        if (!assignUserId) return alert("Please select a user");

        await assignDevice(assignUserId, deviceId);
        alert("Assigned!");
    }

    return (
        <div className="card">
            <h2>Devices</h2>

            {/* CREATE */}
            <form onSubmit={handleCreate}>
                <label>Device Name</label>
                <input
                    value={newDev.name}
                    onChange={(e) => setNewDev({ ...newDev, name: e.target.value })}
                />

                <label>Max Consumption</label>
                <input
                    type="number"
                    value={newDev.maxCons}
                    onChange={(e) =>
                        setNewDev({ ...newDev, maxCons: Number(e.target.value) })
                    }
                />

                <button style={{ width: "100%" }}>Add Device</button>
            </form>

            <hr style={{ margin: "20px 0" }} />

            {/* LIST */}
            {devices.map((d) => (
                <div className="list-row" key={d.id}>
                    {editId === d.id ? (
                        <>
                            <input
                                value={editDev.name}
                                onChange={(e) =>
                                    setEditDev({ ...editDev, name: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                value={editDev.maxCons}
                                onChange={(e) =>
                                    setEditDev({ ...editDev, maxCons: Number(e.target.value) })
                                }
                            />
                            <button onClick={() => handleSave(d.id)}>Save</button>
                            <button className="danger" onClick={() => setEditId(null)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
              <span>
                <strong>{d.name}</strong>
                <div className="muted">Max: {d.maxCons}</div>
              </span>

                            <select onChange={(e) => setAssignUserId(e.target.value)}>
                                <option value="">Assign to user…</option>
                                {users.map((u) => (
                                    <option value={u.id} key={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>

                            <button onClick={() => handleAssign(d.id)}>Assign</button>

                            <button
                                onClick={() => {
                                    setEditId(d.id);
                                    setEditDev({ name: d.name, maxCons: d.maxCons });
                                }}
                            >
                                Edit
                            </button>

                            <button
                                className="danger"
                                onClick={async () => {
                                    await deleteDevice(d.id);
                                    const updated = await getDevices();
                                    setDevices(updated);
                                }}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
