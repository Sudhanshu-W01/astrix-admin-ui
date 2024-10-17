import React from 'react'

interface EventModalProps {
    isModalOpen: (state: boolean) => void;
  }

const ViewEventDocument: React.FC<EventModalProps> = ({isModalOpen}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/2">
        ViewDocument
        </div>
        </div>
        </div>
  )
}

export default ViewEventDocument