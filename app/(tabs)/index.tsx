import React, {useEffect, useState} from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';

const API_URL = 'http://localhost:8080/todos';

type Todo = {
	id: number;
	title: string;
	description?: string;
	completed?: boolean;
};

export default function TodoCrudScreen() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);

	const screenWidth = Dimensions.get('window').width;
	const numColumns = screenWidth > 600 ? 4 : 1; // 3 columns for tablets, 1 for phones
	const itemMargin = 15; // px margin between items
	const itemWidth =
		screenWidth > 600
			? (screenWidth - itemMargin * (numColumns + 1)) / numColumns
			: '100%';
	const itemHeight = 150; // fixed height for all items

	useEffect(() => {
		fetch(API_URL)
			.then((res) => res.json())
			.then(setTodos)
			.catch(() => setTodos([]));
	}, []);

	const handleSubmit = () => {
		const method = editingId ? 'PUT' : 'POST';
		const url = editingId ? `${API_URL}/${editingId}` : API_URL;
		fetch(url, {
			method,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({title, description, completed: false}),
		})
			.then((res) => res.json())
			.then(() => {
				setTitle('');
				setDescription('');
				setEditingId(null);
				fetch(API_URL)
					.then((res) => res.json())
					.then(setTodos);
			});
	};

	const handleDelete = (id: number) => {
		fetch(`${API_URL}/${id}`, {method: 'DELETE'}).then(() => {
			setTodos(todos.filter((t) => t.id !== id));
		});
	};

	const handleEdit = (todo: Todo) => {
		setTitle(todo.title);
		setDescription(todo.description || '');
		setEditingId(todo.id);
	};

	const renderItem = ({item}: {item: Todo}) => (
		<View
			style={{
				width: itemWidth,
				height: itemHeight,
				marginRight: itemMargin / 2,
				marginTop: itemMargin / 2,
			}}
		>
			<View
				style={tw`p-3 border border-gray-200 rounded bg-gray-50 flex-1 justify-between`}
			>
				<View>
					<Text style={tw`font-bold text-lg`}>{item.title}</Text>
					<Text>{item.description}</Text>
				</View>
				<View style={tw`flex-row mt-2`}>
					<TouchableOpacity onPress={() => handleEdit(item)}>
						<Text style={tw`text-blue-500 mr-4`}>Edit</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleDelete(item.id)}>
						<Text style={tw`text-red-500`}>Delete</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	return (
		<View style={tw`flex-1 p-4 bg-white`}>
			<Text style={tw`text-2xl font-bold mb-4`}>Todo CRUD</Text>
			<TextInput
				style={tw`border border-gray-300 p-2 mb-2 rounded`}
				placeholder="Title"
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={tw`border border-gray-300 p-2 mb-2 rounded`}
				placeholder="Description"
				value={description}
				onChangeText={setDescription}
			/>
			<Button
				title={editingId ? 'Update Todo' : 'Add Todo'}
				onPress={handleSubmit}
				disabled={!title || !description}
			/>
			<FlatList
				style={tw`mt-4 flex w-[80vw]`}
				data={todos}
				keyExtractor={(item) => item.id?.toString()}
				numColumns={numColumns}
				renderItem={renderItem}
				contentContainerStyle={{padding: itemMargin / 2}}
			/>
		</View>
	);
}
