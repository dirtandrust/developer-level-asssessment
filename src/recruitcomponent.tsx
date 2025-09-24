import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DeveloperScoringSystem = () => {
  const [currentLevel, setCurrentLevel] = useState('junior');
  const [responses, setResponses] = useState({
    junior: {
      learning_growth: { yes: 0, total: 4 },
      problem_solving: { yes: 0, total: 4 },
      fundamentals: { yes: 0, total: 4 },
      collaboration: { yes: 0, total: 3 },
      professional_mindset: { yes: 0, total: 2 }
    },
    mid: {
      ownership_autonomy: { yes: 0, total: 4 },
      code_quality_architecture: { yes: 0, total: 4 },
      technical_leadership: { yes: 0, total: 4 },
      business_context: { yes: 0, total: 4 },
      collaboration: { yes: 0, total: 3 }
    },
    senior: {
      technical_depth: { yes: 0, total: 4 },
      practical_judgment: { yes: 0, total: 5 },
      communication_leadership: { yes: 0, total: 4 },
      experience_quality: { yes: 0, total: 3 }
    }
  });

  // Scoring weights and thresholds
  const weights = {
    senior: {
      technical_depth: 0.30,
      practical_judgment: 0.35,
      communication_leadership: 0.25,
      experience_quality: 0.10
    },
    mid: {
      ownership_autonomy: 0.30,
      code_quality_architecture: 0.25,
      technical_leadership: 0.20,
      business_context: 0.15,
      collaboration: 0.10
    },
    junior: {
      learning_growth: 0.35,
      problem_solving: 0.30,
      fundamentals: 0.20,
      collaboration: 0.10,
      professional_mindset: 0.05
    }
  };

  const thresholds = {
    senior: 85,
    mid: 70,
    junior: 60
  };

  // Sample questions for demo
  const questions = {
    junior: {
      learning_growth: [
        "Do you actively seek feedback on your code?",
        "Do you research before asking for help?",
        "Have you refactored code without being asked?",
        "Do you read others' code to learn?"
      ],
      problem_solving: [
        "Do you debug systematically?",
        "Do you break down complex problems?",
        "Do you try multiple approaches when stuck?",
        "Do you test with different inputs?"
      ]
    },
    mid: {
      ownership_autonomy: [
        "Have you owned a feature end-to-end?",
        "Do you identify requirement issues proactively?",
        "Have you made time-saving technical decisions?",
        "Can you work independently for weeks?"
      ]
    },
    senior: {
      technical_depth: [
        "Have you designed 10M+ user systems?",
        "Can you explain database indexing trade-offs?",
        "Have you debugged N+1 query issues?",
        "Do you consider memory allocation patterns?"
      ]
    }
  };

  // Calculate scores
  const calculateScores = useMemo(() => {
    const allScores = {};
    
    Object.keys(responses).forEach(level => {
      let weightedScore = 0;
      Object.entries(responses[level]).forEach(([category, answers]) => {
        const categoryScore = (answers.yes / answers.total) * 100;
        weightedScore += categoryScore * (weights[level][category] || 0);
      });
      allScores[level] = Math.round(weightedScore * 10) / 10;
    });

    // Find best fit
    let bestLevel = null;
    let bestScore = 0;
    Object.entries(allScores).forEach(([level, score]) => {
      if (score >= thresholds[level] && score > bestScore) {
        bestLevel = level;
        bestScore = score;
      }
    });

    return { allScores, bestLevel, bestScore };
  }, [responses]);

  const updateResponse = (level, category, increment) => {
    setResponses(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [category]: {
          ...prev[level][category],
          yes: Math.max(0, Math.min(
            prev[level][category].total,
            prev[level][category].yes + increment
          ))
        }
      }
    }));
  };

  const formatCategoryName = (category) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'junior': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { allScores, bestLevel, bestScore } = calculateScores;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Developer Level Assessment</h1>
        <p className="text-gray-600">Answer questions across all levels to determine best fit</p>
      </div>

      {/* Level Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        {['junior', 'mid', 'senior'].map(level => (
          <Button
            key={level}
            variant={currentLevel === level ? "default" : "outline"}
            onClick={() => setCurrentLevel(level)}
            className="capitalize"
          >
            {level} Level
          </Button>
        ))}
      </div>

      {/* Current Level Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{currentLevel} Level Assessment</CardTitle>
          <CardDescription>
            Score: {allScores[currentLevel] || 0}/100 
            {allScores[currentLevel] >= thresholds[currentLevel] && (
              <Badge className="ml-2 bg-green-100 text-green-800">Qualified</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(responses[currentLevel]).map(([category, answers]) => (
            <div key={category} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{formatCategoryName(category)}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateResponse(currentLevel, category, -1)}
                    disabled={answers.yes === 0}
                  >
                    -
                  </Button>
                  <span className="text-sm font-mono min-w-12 text-center">
                    {answers.yes}/{answers.total}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateResponse(currentLevel, category, 1)}
                    disabled={answers.yes === answers.total}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Progress value={(answers.yes / answers.total) * 100} className="h-2" />
              
              {/* Show sample questions if available */}
              {questions[currentLevel]?.[category] && (
                <div className="text-xs text-gray-500 pl-4">
                  <p>Sample questions:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {questions[currentLevel][category].slice(0, 2).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          <CardDescription>
            {bestLevel ? (
              <div className="flex items-center space-x-2">
                <span>Best fit:</span>
                <Badge className={getLevelColor(bestLevel)}>
                  {bestLevel.charAt(0).toUpperCase() + bestLevel.slice(1)} Developer
                </Badge>
                <span>({bestScore}/100)</span>
              </div>
            ) : (
              <span className="text-red-600">No level threshold met</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(allScores).map(([level, score]) => (
              <div key={level} className="text-center">
                <div className="capitalize font-medium mb-2">{level}</div>
                <div className="text-2xl font-bold mb-1">{score}</div>
                <Progress value={score} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  Threshold: {thresholds[level]}
                </div>
                {score >= thresholds[level] && (
                  <Badge className="mt-2 bg-green-100 text-green-800">Qualified</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperScoringSystem;