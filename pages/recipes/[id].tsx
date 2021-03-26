import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Recipe } from "../../lib/recipe";
import { SearchBar } from "..";
import { GetServerSideProps } from "next";
import Head from "../../components/head";
import Image from "next/image";
type Props = {
	recipe: Recipe;
	id: number;
};
const RecipePage: FC<Props> = (prop) => {
	const router = useRouter();
	const id = router.query.id;
	const [recipe, setRecipe] = useState<Recipe | null>(prop.recipe);
	const [additionalrecipes, setAdditionalrecipes] = useState<Recipe[]>([]);
	useEffect(() => {
		setRecipe(prop.recipe);
		(async () => {
			let tmp_array = [];
			let base_url = "https://internship-recipe-api.ckpd.co/recipes";
			for (let i = 0; i < recipe.related_recipes.length; i++) {
				let addires = await fetch(
					base_url + "/" + recipe.related_recipes[i],
					{
						headers: {
							"X-Api-Key": process.env.NEXT_PUBLIC_APIKEY,
						},
					}
				);
				let addirecipe_ = (await addires.json()) as Recipe;
				tmp_array.push(addirecipe_);
			}
			setAdditionalrecipes(tmp_array);
		})();
	}, [prop]);
	if (recipe === null) {
		return <div>Now Loading...</div>;
	}
	return (
		<div className="bg-red-50 font-mono">
			<Head
				title={recipe.title}
				description={recipe.description}
				keyword="key"
				image={
					recipe.image_url
						? recipe.image_url
						: "https://raw.githubusercontent.com/doriasu/spring-internship-2021-recipe-site/develop/resource/noimage.png"
				}
				url={
					"https://takuro-spring-internship-2021-recipe-site.vercel.app/recipes/" +
					String(prop.id)
				}
			/>
			<div className="ml-4 mr-4">
				<SearchBar />
				<br />
				<div className="text-center text-2xl">
					<b>{recipe.title}</b>
				</div>
				<div className="border border-black rounded-2xl bg-gray-200">
					<div className="text-center text-xl m-2">
						<b>詳細</b>
					</div>
					<div className="m-2">{recipe.description}</div>
				</div>
				<br />
				{recipe.image_url ? (
					<Image
						className="border border-black rounded-2xl"
						src={recipe.image_url}
						width="328"
						height="186"
						alt={recipe.title}
					/>
				) : (
					<Image
						className="border border-black rounded-2xl"
						src="https://raw.githubusercontent.com/doriasu/spring-internship-2021-recipe-site/develop/resource/noimage.png"
						width="328"
						height="186"
						alt={recipe.title}
					/>
				)}
				<div className="grid grid-cols-2 gap-2">
					<div className="text-center">{recipe.author.user_name}</div>
					<div className="text-center">
						{recipe.published_at.substr(0, 10)}
					</div>
				</div>
				<br />
				<div className="border border-black rounded-2xl bg-gray-200">
					<div className="text-center text-xl m-2">
						<b>調理手順</b>
					</div>
					<ol className="list-decimal list-inside">
						{recipe !== null
							? recipe.steps.map((text) => {
									return (
										<>
											<li key={text} className="m-2">
												{text}
												<br />
												<br />
											</li>
										</>
									);
							  })
							: null}
					</ol>
				</div>
				<br />
				<div className="border border-black rounded-2xl bg-gray-200">
					<div className="text-center text-xl m-2">
						<b>材料など</b>
					</div>
					<table className="rounded-t-lg m-5 w-5/6 mx-auto bg-gray-200 text-gray-800">
						<tbody>
							<tr className="text-left border-b-2 border-gray-300">
								<th
									className="px-4 py-3 text-center"
									key="zairyo"
								>
									材料
								</th>
								<th
									className="px-4 py-3 text-center"
									key="youryo"
								>
									容量
								</th>
							</tr>
							{recipe !== null
								? recipe.ingredients.map((text) => {
										return (
											<tr
												key={text.name + text.quantity}
												className="bg-gray-100 border-b border-gray-200"
											>
												<td
													className="px-4 py-3"
													key={
														text.name +
														"+" +
														text.quantity
													}
												>
													{text.name}
												</td>
												<td
													className="px-4 py-3"
													key={
														text.name +
														"-" +
														text.quantity
													}
												>
													{text.quantity}
												</td>
											</tr>
										);
								  })
								: null}
						</tbody>
					</table>
				</div>
				<br />
				<div className="text-center text-xl m-2">
					<b>関連レシピ</b>
				</div>
				<div className="grid grid-cols-2 gap-2">
					{additionalrecipes && additionalrecipes.length != 0
						? additionalrecipes.map((addr) => {
								return (
									<Link
										key={addr.id}
										href={"/recipes/" + addr.id}
										passHref
									>
										<div className="border border-black rounded-2xl bg-gray-200">
											{addr.image_url ? (
												<Image
													className="rounded-2xl"
													key={addr.id}
													src={addr.image_url}
													width="166"
													height="93"
													alt={addr.title}
												/>
											) : (
												<Image
													className="rounded-2xl"
													key={addr.id}
													src="https://raw.githubusercontent.com/doriasu/spring-internship-2021-recipe-site/develop/resource/noimage.png"
													width="166"
													height="93"
													alt={addr.title}
												/>
											)}
											<div className="text-center">
												{addr.title}
											</div>
										</div>
									</Link>
								);
						  })
						: null}
				</div>
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = Number(context.params?.id);
	let base_url = "https://internship-recipe-api.ckpd.co/recipes";
	const res = await fetch(base_url + "/" + id, {
		headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
	});
	const recipe_ = (await res.json()) as Recipe;
	return {
		props: {
			recipe: recipe_,
			id: id,
		},
	};
};
export default RecipePage;
