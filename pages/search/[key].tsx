import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
	global_bg_color,
	global_img_bg_color,
	global_layout,
	Recipe,
} from "../../lib/recipe";
import Link from "next/link";
import { SearchBar } from "..";
const searchPage: FC = () => {
	const [searchtext, setSearchtext] = useState("");
	const router = useRouter();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [pagenum, setPagenum] = useState<number>(1);
	let key = router.query.key as string;
	let num: number = +router.query.num;
	useEffect(() => {
		(async () => {
			if (key) {
				key = key as string;
				setPagenum(num ? num : 1);
				const base_url = new URL(
					"https://internship-recipe-api.ckpd.co/search"
				);
				base_url.searchParams.set("keyword", key);
				if (num && num > 1) {
					base_url.searchParams.set(
						"page",
						router.query.num as string
					);
				}
				const res = await fetch(base_url.toString(), {
					headers: { "X-Api-Key": process.env.NEXT_PUBLIC_APIKEY },
				});
				const recipes = await res.json();
				setRecipes(recipes["recipes"] as Recipe[]);
			}
		})();
	}, [key, num]);
	return (
		<div className={global_bg_color}>
			<div className={global_layout}>
				<SearchBar />
				<br />
				<div className="text-2xl">
					<b>{key + "の検索結果"}</b>
				</div>
				<br />
				<div className="grid grid-cols-2 gap-2">
					{recipes ? (
						recipes.map((r) => {
							return r.image_url ? (
								<Link
									key={r.id}
									href={"/recipes/" + r.id}
									passHref
								>
									<div className={global_img_bg_color}>
										<img
											className="rounded-2xl"
											src={r.image_url}
										/>
										<div>{r.title}</div>
									</div>
								</Link>
							) : null;
						})
					) : (
						<div>No recipes founded.</div>
					)}
				</div>
				<br />
				<div className="grid grid-cols-2">
					{pagenum > 1 ? (
						<button
							onClick={() => {
								if (pagenum > 1) {
									router.push({
										pathname: "/search/" + key,
										query: { num: pagenum - 1 },
									});
								}
							}}
						>
							Prev
						</button>
					) : (
						<div></div>
					)}
					<button
						onClick={() => {
							router.push({
								pathname: "/search/" + key,
								query: { num: pagenum + 1 },
							});
						}}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};
export default searchPage;
