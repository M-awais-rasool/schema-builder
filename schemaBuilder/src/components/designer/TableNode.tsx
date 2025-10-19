import { Table } from "lucide-react";
import { motion } from "framer-motion";
import {
    Handle,
    Position,
} from 'reactflow';
import type { TableField } from "../../types/designer";

export const TableNode = ({ data, selected }: { data: any; selected: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
                duration: 0.4,
                ease: "easeOut",
                delay: data.animationDelay || 0
            }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-300 min-w-60 relative
      ${selected
                ? 'border-indigo-500 shadow-xl shadow-indigo-500/25'
                : 'border-gray-200 hover:border-indigo-300'
            }
      hover:shadow-xl
    `}>
            <motion.div 
                className="bg-black text-white px-4 py-3 rounded-t-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (data.animationDelay || 0) + 0.2 }}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{data.label}</h3>
                    <Table className="w-4 h-4" />
                </div>
            </motion.div>

            <div className="p-0">
                {data.fields?.map((field: TableField, index: number) => (
                    <motion.div 
                        key={field.id} 
                        className="relative group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                            delay: (data.animationDelay || 0) + 0.3 + (index * 0.1),
                            duration: 0.3
                        }}
                    >
                        <div className="flex items-center justify-between p-3 text-xs border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center space-x-2 flex-1">
                                <div className="flex items-center space-x-1">
                                    {field.isPrimaryKey && (
                                        <motion.div 
                                            className="w-2 h-2 bg-yellow-500 rounded-full" 
                                            title="Primary Key"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: (data.animationDelay || 0) + 0.5 + (index * 0.1) }}
                                        />
                                    )}
                                    {field.isForeignKey && (
                                        <motion.div 
                                            className="w-2 h-2 bg-blue-500 rounded-full" 
                                            title="Foreign Key"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: (data.animationDelay || 0) + 0.5 + (index * 0.1) }}
                                        />
                                    )}
                                    {field.isUnique && !field.isPrimaryKey && (
                                        <motion.div 
                                            className="w-2 h-2 bg-green-500 rounded-full" 
                                            title="Unique"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: (data.animationDelay || 0) + 0.5 + (index * 0.1) }}
                                        />
                                    )}
                                </div>
                                <span className={`font-medium ${field.isPrimaryKey ? 'text-yellow-600' : field.isForeignKey ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {field.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-gray-500 text-xs">{field.type}</span>
                                {!field.isNotNull && (
                                    <span className="text-gray-400 text-xs">NULL</span>
                                )}
                            </div>
                        </div>

                        {field.isPrimaryKey && (
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={field.id}
                                style={{
                                    right: -6,
                                    width: 12,
                                    height: 12,
                                    background: '#eab308',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    zIndex: 10,
                                }}
                            />
                        )}

                        {!field.isPrimaryKey && (
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={field.id}
                                style={{
                                    left: -6,
                                    width: 12,
                                    height: 12,
                                    background: field.isForeignKey ? '#3b82f6' : '#6b7280',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    zIndex: 10,
                                }}
                            />
                        )}
                    </motion.div>
                ))}
                {(!data.fields || data.fields.length === 0) && (
                    <motion.div 
                        className="p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (data.animationDelay || 0) + 0.3 }}
                    >
                        <p className="text-gray-400 text-xs italic">No fields defined</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};