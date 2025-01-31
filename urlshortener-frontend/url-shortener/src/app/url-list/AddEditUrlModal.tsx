import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Url } from "@/interfaces/url";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddEditUrlModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddOrUpdateUrl: (newUrl: { longUrl: string; name: string; expiresAt?: Date }) => void;
    editingUrl: Url | null;
}

export default function AddEditUrlModal({ isOpen, onClose, onAddOrUpdateUrl, editingUrl }: AddEditUrlModalProps) {
    const [name, setName] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    useEffect(() => {
        if (editingUrl) {
            setName(editingUrl.name);
            setOriginalUrl(editingUrl.longUrl);
            setExpiresAt(editingUrl.expiresAt ? new Date(editingUrl.expiresAt) : null);
        } else {
            setName("");
            setOriginalUrl("");
            setExpiresAt(null);
        }
    }, [editingUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !originalUrl) {
            toast.error("Please fill in all required fields.");
            return;
        }

        onAddOrUpdateUrl({ longUrl: originalUrl, name , expiresAt: expiresAt || undefined});
        setName("");
        setOriginalUrl("");
        setExpiresAt(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">{editingUrl ? "Edit URL" : "Add New URL"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Original URL</label>
                        <input
                            type="url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
                      <DatePicker
                        selected={expiresAt}
                        onChange={(date: Date | null) => {
                          console.log("Selected Date:", date); 
                          setExpiresAt(date);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        isClearable
                        placeholderText="Select expiration date"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {editingUrl ? "Update URL" : "Add URL"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}