import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Recipe } from "../../lib/recipe";
import Link from "next/link";
import { SearchBar } from "..";
const searchPage: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const router = useRouter();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	let key = router.query.key as string;
	// console.log(key)
	useEffect(() => {
		(async () => {
			if (key) {
				key = key as string;
				const base_url = new URL(
					"https://internship-recipe-api.ckpd.co/search"
				);
				base_url.searchParams.set("keyword", key);
				const res = await fetch(base_url.toString(), {
					headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
				});
				const recipes = await res.json();
				setRecipes(recipes["recipes"] as Recipe[]);
			}
		})();
	}, [key]);
	return (
		<div>
			<SearchBar />
			<br />
			<h1>
				<b>{key + "の検索結果"}</b>
			</h1>
			<div className="grid grid-cols-2">
				{recipes
					? recipes.map((r) => {
							return r.image_url ? (
								<Link
									key={r.id}
									href={"/recipes/" + r.id}
									passHref
								>
									<img src={r.image_url} />
								</Link>
							) : null;
					  })
					: null}
			</div>
		</div>
	);
};
export default searchPage;
