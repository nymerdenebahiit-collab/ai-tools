"use client";
 
import { useState } from "react";
import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Recognition() {
  const [prompt, setPrompt] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
 
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
 
    try {
      setLoading(true);
 
      const response = await axios.post(
        "https://ai-image-back-rfqe.onrender.com/recognize",
        {
          prompt,
        }
      );
 
      console.log(response);
 
      if (response.data.success) {
        const detectedIngredients = response.data.data
          .split(/,|\n/)
          .map((item: string) => item.trim())
          .filter(Boolean);
 
        setIngredients(detectedIngredients);
      } else {
        setIngredients([]);
      }
    } catch (err) {
      console.error(err);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <TabsContent value="ingredient-recognition">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Ingredient Recognition</CardTitle>
          <CardDescription>
            Describe a food and AI will list the ingredients
          </CardDescription>
        </CardHeader>
 
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. Chicken pizza with mushrooms and cheese"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-30"
          />
 
          {ingredients.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Detected ingredients</p>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item, i) => (
                  <Badge key={i} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
 
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Analyzing..." : "Generate"}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
 
 
