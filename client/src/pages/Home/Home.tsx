import React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from 'axios'
import api from '@/config/axiosInstance'


const HomePage: React.FC = () => {

  const [pageUrl, setPageUrl] = useState('')
  const [visibility, setVisibility] = useState('public')
  const [expiresIn, setExpiresIn] = useState('')

  const gh = async () => {
    try {

      const datas = await api.get('auth/protected');

      console.log(datas.data)
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
 
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-gray-800">Next Hire</h1>
          <p className="text-lg md:text-xl text-gray-600">The easiest way to jot down and share text online</p>
        </div>

        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row mb-6">
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-t-md md:rounded-l-md md:rounded-tr-none border border-b-0 md:border-b md:border-r-0 text-center md:text-left">
              nexthire.com/
            </div>
            <Input
              type="text"
              placeholder="your-secret-page"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              className="flex-grow rounded-t-none md:rounded-l-none md:rounded-r-none"
            />
            <Button onClick={gh} className="mt-2 md:mt-0 md:ml-2 w-full md:w-auto">Go!</Button>
          </div>

          <RadioGroup value={visibility} onValueChange={setVisibility} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Private</Label>
            </div>
          </RadioGroup>

          <div className="mb-6">
            <Label htmlFor="expires-in" className="mb-2 block">Expires In</Label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger id="expires-in">
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="1w">1 week</SelectItem>
                <SelectItem value="1m">1 month</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-center text-sm text-gray-500">No login required</p>
        </div>
      </main>
    </>
  )
}

export default HomePage