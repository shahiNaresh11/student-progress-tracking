import React from 'react';
import { BookOpen, AlertTriangle, Info, AlertCircle, Star, TrendingUp, Flag, CheckCircle } from 'lucide-react';

const Recommendations = ({ recommendation }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
            <div className="flex items-center mb-4">
                <BookOpen className="mr-2 text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">Personalized Recommendations</h3>
            </div>

            {recommendation?.recommendations ? (
                <div className="space-y-6">
                    {/* Behavior Improvements Section */}
                    <div className="border-b pb-4">
                        <h4 className="font-semibold text-red-600 flex items-center mb-3">
                            <AlertTriangle className="mr-2" size={18} />
                            Areas Needing Improvement
                        </h4>
                        {recommendation.recommendations.behaviorImprovements?.length > 0 ? (
                            <div className="space-y-4">
                                {recommendation.recommendations.behaviorImprovements.map((item, idx) => (
                                    <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-1">
                                                {item.severity >= 2 ? (
                                                    <AlertTriangle className="text-red-500 mr-2" size={18} />
                                                ) : (
                                                    <AlertCircle className="text-orange-500 mr-2" size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-red-800">
                                                    {item.issue}
                                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                                        Occurred {item.occurrenceCount} time{item.occurrenceCount > 1 ? 's' : ''}
                                                    </span>
                                                </h5>
                                                <p className="text-gray-700 mt-1">{item.specificRecommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-green-800">
                                <CheckCircle className="inline mr-2" size={18} />
                                No behavior improvements needed - great job!
                            </div>
                        )}
                    </div>

                    {/* Positive Actions Section */}
                    <div className="border-b pb-4">
                        <h4 className="font-semibold text-green-600 flex items-center mb-3">
                            <Star className="mr-2" size={18} />
                            Opportunities To Earn Points
                        </h4>
                        {recommendation.recommendations.positiveActionOpportunities?.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {recommendation.recommendations.positiveActionOpportunities.map((item, idx) => (
                                    <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-1">
                                                <Star className="text-green-500 mr-2" size={18} />
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-green-800">{item.action}</h5>
                                                <p className="text-gray-700 mt-1 text-sm">{item.implementationTips?.join(' ')}</p>
                                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                                    <TrendingUp className="mr-1" size={14} />
                                                    <span>Adopted by {item.adoptionRate} • Avg. {item.averagePoints} pts</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                                <Info className="inline mr-2" size={18} />
                                No positive action opportunities identified
                            </div>
                        )}
                    </div>

                    {/* Enhanced Priority List Section */}
                    <div>
                        <h4 className="font-semibold text-blue-600 flex items-center mb-3">
                            <Flag className="mr-2" size={18} />
                            Priority Recommendations
                        </h4>
                        {recommendation.recommendations.combinedPriorityList?.length > 0 ? (
                            <div className="space-y-3">
                                {recommendation.recommendations.combinedPriorityList.map((item, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border ${idx < 2 ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-1">
                                                {item.type === 'BEHAVIOR_CORRECTION' ? (
                                                    <AlertTriangle className="text-red-500 mr-2" size={18} />
                                                ) : (
                                                    <Star className="text-green-500 mr-2" size={18} />
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="font-medium">
                                                        {item.type === 'BEHAVIOR_CORRECTION' ?
                                                            `Behavior: ${item.issue}` :
                                                            `Action: ${item.action}`}
                                                    </h5>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                        Priority: {item.priorityScore}
                                                    </span>
                                                </div>

                                                {item.type === 'BEHAVIOR_CORRECTION' ? (
                                                    <>
                                                        <p className="text-gray-700 mt-1 text-sm">{item.specificRecommendation}</p>
                                                        <div className="mt-2 bg-red-100/50 p-2 rounded text-sm">
                                                            <span className="font-medium">Impact: </span>
                                                            {item.severity >= 4 ? (
                                                                <span>Critical - Could save you <span className="font-bold">{item.priorityScore} points</span> by avoiding this behavior</span>
                                                            ) : (
                                                                <span>Important - Could save you <span className="font-bold">{item.priorityScore} points</span> by improving this behavior</span>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-700 mt-1 text-sm">{item.implementationTips?.join(' ')}</p>
                                                        <div className="mt-2 bg-green-100/50 p-2 rounded text-sm">
                                                            <span className="font-medium">Potential Gain: </span>
                                                            <span>Could earn you <span className="font-bold">{item.averagePoints} points</span> on average (Priority score: {item.priorityScore})</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                                <Info className="inline mr-2" size={18} />
                                No priority recommendations available
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                    <Info className="inline mr-2" size={18} />
                    No recommendation available at the moment.
                </div>
            )}
        </div>
    );
};

export default Recommendations;