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
      "Do you actively seek feedback on your code from more experienced developers?",
      "When you don't understand something, do you research it before asking for help?",
      "Have you ever refactored your own code to make it cleaner without being asked?",
      "Do you read code written by others to learn new approaches?"
    ],
    problem_solving: [
      "When debugging, do you use print statements/debuggers systematically rather than randomly?",
      "Do you break down complex problems into smaller pieces before coding?",
      "When stuck on a problem, do you try multiple approaches before giving up?",
      "Do you test your code with different inputs, including edge cases?"
    ],
    fundamentals: [
      "Do you understand why we use version control beyond just 'it's required'?",
      "Can you explain what happens when you type a URL into a browser?",
      "Do you write comments that explain 'why' rather than just 'what'?",
      "Do you consider how your code will be read by other developers?"
    ],
    collaboration: [
      "Do you ask clarifying questions when requirements seem unclear?",
      "Are you comfortable admitting when you don't know something?",
      "Do you proactively communicate when you're blocked on a task?"
    ],
    professional_mindset: [
      "Do you research the company/product before working on features?",
      "Do you consider the user impact of the code you write?"
    ]
  },
  mid: {
    ownership_autonomy: [
      "Have you owned a feature end-to-end from requirements to production deployment?",
      "Do you proactively identify potential issues in requirements before starting implementation?",
      "Have you made a technical decision that saved the team significant time or effort?",
      "Can you work independently for days/weeks without constant check-ins?"
    ],
    code_quality_architecture: [
      "Do you consider the maintainability of your code for developers who will work on it later?",
      "Have you refactored a significant piece of code to improve its structure?",
      "Do you think about error handling and edge cases during the design phase, not just implementation?",
      "Have you designed database schemas or API contracts that other developers use?"
    ],
    technical_leadership: [
      "Have you reviewed code and provided constructive feedback to improve it?",
      "Do you speak up in technical discussions when you disagree with proposed solutions?",
      "Have you helped onboard a new team member or junior developer?",
      "Can you estimate project timelines that consistently prove accurate?"
    ],
    business_context: [
      "Do you consider performance implications when choosing between different implementation approaches?",
      "Have you pushed back on a feature request due to technical complexity or risk?",
      "Do you understand how your work connects to business metrics or user outcomes?",
      "Have you suggested technical improvements that directly benefited users or business goals?"
    ],
    collaboration: [
      "Do you communicate technical blockers to non-technical stakeholders effectively?",
      "Have you worked directly with product managers or designers to refine requirements?",
      "Can you translate business requirements into technical tasks without heavy guidance?"
    ]
  },
  senior: {
    technical_depth: [
      "Have you designed a system that handles 10M+ daily active users?",
      "Can you explain database indexing trade-offs without looking it up?",
      "Have you debugged a production performance issue caused by N+1 queries?",
      "Do you regularly consider memory allocation patterns when writing code?"
    ],
    practical_judgment: [
      "Have you ever recommended NOT building a feature due to technical complexity vs business value?",
      "When inheriting legacy code, do you refactor incrementally rather than rewriting from scratch?",
      "Have you shipped a 'good enough' solution knowing it wasn't perfect?",
      "Do you estimate tasks by breaking them into smaller components first?",
      "Have you made architecture decisions that prevented future technical debt?"
    ],
    communication_leadership: [
      "Have you successfully convinced a team to change technical direction?",
      "Can non-technical stakeholders understand your technical explanations?",
      "Have you mentored a junior developer who later received a promotion?",
      "Do you document architectural decisions for future developers?"
    ],
    experience_quality: [
      "Have you worked on a team where your technical decisions had significant business impact?",
      "Have you been responsible for system uptime in a production environment?",
      "Have you led a technical migration that improved system performance?"
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
    switch (level) {
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
                    {questions[currentLevel][category].map((q, i) => (
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