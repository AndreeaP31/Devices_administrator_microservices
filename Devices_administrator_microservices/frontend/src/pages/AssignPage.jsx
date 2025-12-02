import { useEffect, useState } from "react";
import { getUsers, getDevices, assignDevice } from "../api";

export default function AssignPage() {
    const [users, setUsers] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selected, setSelected] = useState({ userId: "", deviceId: "" });

    useEffect(() => {
        getUsers().then(setUsers);
        getDevices().then(setDevices);
    }, []);

    async function assign() {
        console.log("Assigning:", selected); // debug
        await assignDevice(selected.userId, selected.deviceId);
        alert("Assigned!");
    }

    return (
        <div>
            <h2>Assign Device</h2>

            {/* USER SELECT */}
            <select
                onChange={e =>
                    setSelected({ ...selected, userId: e.target.value })
                }
            >
                <option key="none" value="">Select user</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>

            {/* DEVICE SELECT */}
            <select
                onChange={e =>
                    setSelected({ ...selected, deviceId: e.target.value })
                }
            >
                <option key="none-device" value="">Select device</option>
                {devices.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                ))}
            </select>

            <button onClick={assign}>Assign</button>
        </div>
    );
}
