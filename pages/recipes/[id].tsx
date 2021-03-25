import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
	Recipe,
	global_bg_color,
	global_img_bg_color,
	global_layout,
} from "../../lib/recipe";
import { SearchBar } from "..";
const RecipePage: FC = () => {
	const router = useRouter();
	const id = router.query.id;
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [additionalrecipes, setAdditionalrecipes] = useState<Recipe[]>([]);
	useEffect(() => {
		(async () => {
			if (id) {
				const id = router.query.id as string;
				let base_url = "https://internship-recipe-api.ckpd.co/recipes";
				const res = await fetch(base_url + "/" + id, {
					headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
				});
				const recipe_ = (await res.json()) as Recipe;
				setRecipe(recipe_);
				let tmp_array = [];
				for (let i = 0; i < recipe_.related_recipes.length; i++) {
					let addires = await fetch(
						base_url + "/" + recipe_.related_recipes[i],
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
			}
		})();
	}, [id]);
	if (recipe === null) {
		return <div>Now Loading...</div>;
	}
	return (
		<div className={global_bg_color}>
			<div className={global_layout}>
				<SearchBar />
				<br />
				<div className="text-center text-2xl">
					<b>{recipe.title}</b>
				</div>
				<div className="border border-black rounded-2xl bg-gray-200">
					<div>{recipe.published_at.substr(0, 10)}</div>
					<div>{recipe.author.user_name}</div>
					<div>{recipe.description}</div>
				</div>
				<br />
				<img
					className="border border-black rounded-2xl"
					src={recipe.image_url}
				/>
				<br />
				<div className="border border-black rounded-2xl bg-gray-200">
					<div className="text-center text-xl">
						<b>調理手順</b>
					</div>
					<ol className="list-decimal list-inside">
						{recipe !== null
							? recipe.steps.map((text) => {
									return (
										<div>
											<li key={text}>{text}</li>
											<br />
										</div>
									);
							  })
							: null}
					</ol>
				</div>
				<br />
				<div className="border border-black rounded-2xl bg-gray-200">
					<div className="text-center text-xl">
						<b>材料</b>
					</div>
					<ul className="list-disc list-inside">
						{recipe !== null
							? recipe.ingredients.map((text) => {
									return (
										<li key={text.name}>
											{text.name}:{text.quantity}
										</li>
									);
							  })
							: null}
					</ul>
				</div>
				<br />
				<div className="text-center text-xl">
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
										<div className={global_img_bg_color}>
											<img
												className="rounded-2xl"
												key={addr.id}
												src={addr.image_url}
											/>
											<div>{addr.title}</div>
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
export default RecipePage;
