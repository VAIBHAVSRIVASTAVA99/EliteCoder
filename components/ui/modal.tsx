"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (filename: string) => void
  title: string
  placeholder?: string
  defaultValue?: string
}

export function Modal({ isOpen, onClose, onSave, title, placeholder = "Enter filename", defaultValue = "" }: ModalProps) {
  const [filename, setFilename] = useState(defaultValue)

  useEffect(() => {
    setFilename(defaultValue)
  }, [defaultValue])

  const handleSave = () => {
    if (filename.trim()) {
      onSave(filename.trim())
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-orange-500/30 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="filename" className="text-gray-300">
              Filename
            </Label>
            <Input
              id="filename"
              type="text"
              placeholder={placeholder}
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={handleKeyPress}
              className="bg-black/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
              autoFocus
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSave}
              disabled={!filename.trim()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-600 hover:to-yellow-600"
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 