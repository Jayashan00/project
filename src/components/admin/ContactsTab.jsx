import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Send } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const ContactsTab = ({ contacts }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResponse = async () => {
    if (!response.trim()) return;

    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSelectedContact(null);
      setResponse('');
    } catch (error) {
      console.error('Failed to send response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Contact Inquiries</h2>
          <div className="space-y-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{contact.name}</h3>
                    <Badge color={contact.responded ? 'green' : 'yellow'}>
                      {contact.responded ? 'Responded' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{contact.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Respond to {selectedContact.name}</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows="4"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-cyan-500"
                  placeholder="Type your response here..."
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedContact(null);
                    setResponse('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!response.trim() || isLoading}
                  onClick={handleSendResponse}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
